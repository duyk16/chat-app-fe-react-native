import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { IMessage, GiftedChat } from 'react-native-gifted-chat';

import Api from '../services/api';
import { ConversationMember } from './conversation.slice';

export interface ChatState {
  messages: IMessage[];
  members: ConversationMember[];

  isLoading: boolean;
}

const initialState: ChatState = {
  messages: [],
  members: [],

  isLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversationMembers(state, action: PayloadAction<ConversationMember[]>) {
      state.members = action.payload;
    },
    getMessagesSuccess(state, action: PayloadAction<MessageResponse[]>) {
      state.isLoading = true;

      const messages: IMessage[] = action.payload.map((item) => {
        const user = state.members.find((member) => member._id === item.owner);
        return {
          _id: item._id,
          text: item.content,
          createdAt: new Date(item.createdAt || 0),
          user: {
            _id: user?._id,
            name: user?.displayName,
          },
          sent: true,
        } as IMessage;
      });
      state.messages = messages;
    },

    startSendMessage(state, action: PayloadAction<IMessage>) {
      const user = state.members.find(
        (member) => member._id === action.payload.user._id,
      );
      action.payload.pending = true;
      action.payload.user.name = user?.displayName;
      state.messages = GiftedChat.append(state.messages, [action.payload]);
    },
    sendMessageSuccess(
      state,
      action: PayloadAction<{ _id: string; newId: string }>,
    ) {
      let message = state.messages.find(
        (item) => item._id === action.payload._id,
      );

      if (message) {
        message._id = action.payload.newId;
        message.pending = false;
        message.sent = true;
      }
    },
    addMessage(state, action: PayloadAction<MessageResponse>) {
      const user = state.members.find(
        (member) => member._id === action.payload.owner,
      );

      const message: IMessage = {
        _id: action.payload._id,
        text: action.payload.content,
        image: action.payload.image,
        createdAt: new Date(action.payload.createdAt),
        sent: true,
        user: {
          _id: user!._id,
          name: user!.displayName,
        },
      };

      state.messages = GiftedChat.append(state.messages, [message]);
    },
  },
});

export const chatReducer = chatSlice.reducer;
export const chatActions = chatSlice.actions;

/**
 * Initial messages
 */
export interface MessageResponse {
  _id: string;
  content: string;
  owner: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export const getMessages = (conversationId: string) => async (
  dispatch: Dispatch,
) => {
  try {
    const response = await Api.get<MessageResponse[]>(
      `/conversations/${conversationId}/messages`,
    );

    await new Promise((res) => setTimeout(res, 1000));

    dispatch(chatActions.getMessagesSuccess(response.data));
  } catch (error) {}
};

/**
 * Add new message
 */
export const sendMessage = (conversation: string, message: IMessage) => async (
  dispatch: Dispatch,
) => {
  dispatch(chatActions.startSendMessage(message));
  try {
    const response = await Api.post<{ _id: string }>('/messages', {
      conversation,
      content: message.text,
    });

    dispatch(
      chatActions.sendMessageSuccess({
        _id: `${message._id}`,
        newId: response.data._id,
      }),
    );
  } catch (error) {}
};

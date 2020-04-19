import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { IMessage, GiftedChat } from 'react-native-gifted-chat';

import Api from '../services/api';
import { ConversationMember } from './conversation.slice';

export interface ChatState {
  messages: IMessage[];
  members: ConversationMember[];

  isLoading: boolean;

  loadEarlier: boolean;
  isLoadingEarlier: boolean;
  start: number;
  end: number;
  last: number;
}

const initialState: ChatState = {
  messages: [],
  members: [],

  isLoading: false,

  loadEarlier: false,
  isLoadingEarlier: false,
  start: 0,
  end: 0,
  last: 0,
};

const mapMessages = (
  messages: MessageResponse[],
  members: ConversationMember[],
): IMessage[] => {
  return messages.map((item) => {
    const user = members.find((member) => member._id === item.owner);
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
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversationMembers(state, action: PayloadAction<ConversationMember[]>) {
      state.members = action.payload;
    },

    /**
     * GET initial messages
     */
    getMessagesSuccess(state, action: PayloadAction<GetMessagesResponse>) {
      state.loadEarlier = action.payload.end < action.payload.last;
      state.isLoading = true;
      state.start = action.payload.start;
      state.end = action.payload.end;
      state.last = action.payload.last;
      state.messages = mapMessages(action.payload.data, state.members);
    },

    /**
     * Load earlier messages
     */
    startLoadEarlierMessages(state) {
      state.isLoadingEarlier = true;
    },
    loadEarlierMessagesSuccess(
      state,
      action: PayloadAction<GetMessagesResponse>,
    ) {
      state.loadEarlier = action.payload.end < action.payload.last;
      state.isLoadingEarlier = false;
      state.start = action.payload.start;
      state.end = action.payload.end;
      state.last = action.payload.last;

      const messages = mapMessages(action.payload.data, state.members);

      state.messages = GiftedChat.append(messages, state.messages);
    },
    loadEarlierMessagesFail(state, action) {
      state.loadEarlier = true;
      state.isLoadingEarlier = false;
    },

    /**
     * Send messages
     */
    startSendMessage(state, action: PayloadAction<IMessage>) {
      const user = state.members.find(
        (member) => member._id === action.payload.user._id,
      );
      action.payload.pending = true;
      action.payload.user.name = user?.displayName;
      state.messages = GiftedChat.append(state.messages, [action.payload]);

      state.start++;
      state.end++;
      state.last++;
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

    /**
     * Receive message
     */
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
interface GetMessagesResponse {
  data: MessageResponse[];
  start: number;
  end: number;
  last: number;
}
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
    const response = await Api.get<GetMessagesResponse>(
      `/conversations/${conversationId}/messages`,
    );

    dispatch(chatActions.getMessagesSuccess(response.data));
  } catch (error) {}
};

/**
 * Load earlier messages
 */
export const loadMessagesEarlier = (
  conversationId: string,
  start: number,
  end: number,
) => async (dispatch: Dispatch) => {
  dispatch(chatActions.startLoadEarlierMessages());
  try {
    let response = await Api.get<GetMessagesResponse>(
      `/conversations/${conversationId}/messages?start=${start}&end=${end}`,
    );

    dispatch(chatActions.loadEarlierMessagesSuccess(response.data));
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

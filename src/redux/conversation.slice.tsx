import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import Api from '../services/api';

export interface ConversationState {
  conversations: Conversation[];

  isLoading: boolean;
}

const initialState: ConversationState = {
  conversations: [],

  isLoading: true,
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    loadConversationsSuccess(state, action: PayloadAction<Conversation[]>) {
      state.isLoading = false;
      state.conversations = action.payload;
    },
  },
});

export const conversationReducer = conversationSlice.reducer;

export const conversationActions = conversationSlice.actions;

/**
 * Load conversations
 */
interface Conversation {
  _id: string;
  members: ConversationMember[];
  createdAt: string;
  updatedAt: string;
}
export interface ConversationMember {
  _id: string;
  email: string;
  displayName: string;
  updatedAt: string;
}
export const loadConversations = () => async (dispatch: Dispatch) => {
  try {
    const response = await Api.get<Conversation[]>('/conversations');

    dispatch(conversationActions.loadConversationsSuccess(response.data));
  } catch (error) {
    throw error;
  }
};

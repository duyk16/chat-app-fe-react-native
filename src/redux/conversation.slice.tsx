import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

export interface ConversationState {}

const initialState: ConversationState = {};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {},
});

const conversationReducer = conversationSlice.reducer;
export default conversationReducer;

export const conversationActions = conversationSlice.actions;
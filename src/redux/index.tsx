import { combineReducers, Reducer } from 'redux';

import { authReducer, AuthState } from './auth.slice';
import { conversationReducer, ConversationState } from './conversation.slice';
import { chatReducer, ChatState } from './chat.slice';

export interface RootState {
  auth: AuthState;
  conversation: ConversationState;
  chat: ChatState;
}

const rootReducer: Reducer<RootState> = combineReducers({
  auth: authReducer,
  conversation: conversationReducer,
  chat: chatReducer,
});

export default rootReducer;

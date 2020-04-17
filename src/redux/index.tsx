import { combineReducers, Reducer } from 'redux';

import authReducer, { AuthState } from './auth.slice';

export interface RootState {
  auth: AuthState;
  //   chatroom: ConversationState;
  //   message: MessageState;
}

const rootReducer: Reducer<RootState> = combineReducers({
  auth: authReducer,
  //   chatroom: chatroomReducer,
  //   message: messageReducer,
});

export default rootReducer;

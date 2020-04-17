import { combineReducers, Reducer } from 'redux';

import userReducer, { UserState } from './user.slice';

export interface RootState {
  user: UserState;
  //   chatroom: ConversationState;
  //   message: MessageState;
}

const rootReducer: Reducer<RootState> = combineReducers({
  user: userReducer,
  //   chatroom: chatroomReducer,
  //   message: messageReducer,
});

export default rootReducer;

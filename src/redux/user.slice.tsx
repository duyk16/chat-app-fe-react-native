import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import Api from '../services/api';
import { AxiosError } from 'axios';

export interface UserInfo {
  _id: string;
  email: string;
  displayName: string;
}

export interface UserState {
  users: UserInfo[];

  isLoading: boolean;
  loadingError: string;
  start: number;
  end: number;
  last: number;

  isLoadingCreateConversation: boolean;
  targetConversation: string;
  createConversationError: string;
}

const initialState: UserState = {
  users: [],

  isLoading: false,
  loadingError: '',
  start: 0,
  end: 0,
  last: 0,

  isLoadingCreateConversation: false,
  targetConversation: '',
  createConversationError: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {

    /**
     * Clear state
     */
    clearState(state) {
      return initialState
    },

    /**
     * Get user list
     */
    startGetUserList(state) {
      state.isLoading = true;
    },
    getUserListSuccess(state, action: PayloadAction<GetUserResponse>) {
      state.isLoading = false;

      state.users = action.payload.data;
      state.start = action.payload.start;
      state.end = action.payload.end;
      state.last = action.payload.last;
    },
    getUserListFail(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.loadingError = action.payload;
    },

    /**
     * Create conversation
     */
    startCreateConversation(state) {
      state.isLoadingCreateConversation = true;
    },
    createConversationSuccess(state, action: PayloadAction<string>) {
      state.isLoadingCreateConversation = false;
      state.targetConversation = action.payload;
    },
    createConversationFail(state, action: PayloadAction<string>) {
      state.isLoadingCreateConversation = false;
      state.createConversationError = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;

/**
 * Get user list
 */
export interface GetUserResponse {
  data: UserInfo[];
  start: number;
  end: number;
  last: number;
}
export const getUserList = () => async (dispatch: Dispatch) => {
  dispatch(userActions.startGetUserList());
  try {
    const response = await Api.get<GetUserResponse>(`/users?start=0&end=20`);
    dispatch(userActions.getUserListSuccess(response.data));
    console.log(response);
  } catch (error) {
    console.log(error);
    dispatch(userActions.getUserListFail('Get user list fail'));
  }
};

/**
 * Create conversation
 */
export interface CreateConversationResponse {
  _id: string;
  createdAt: string;
}
export const createConversation = (targetUserId: string) => async (
  dispatch: Dispatch,
) => {
  dispatch(userActions.startCreateConversation());
  try {
    const response = await Api.post<CreateConversationResponse>(
      '/conversations',
      {
        members: [targetUserId],
      },
    );

    dispatch(userActions.createConversationSuccess(response.data._id));
  } catch (error) {
    if (error.isAxiosError) {
      let axiosError = error as AxiosError;
      if (axiosError.response?.status == 409) {
        dispatch(
          userActions.createConversationSuccess(
            axiosError.response.data.conversationId,
          ),
        );
        return;
      }
    }
    dispatch(userActions.createConversationFail('Create conversation fail!'));
  }
};

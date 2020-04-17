import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  userId: string;
  email: string;
  // avatar: string;
  isAuthLoading: boolean;
  isAuth: boolean;
};

const initialState: UserState = {
  userId: '',
  email: '',
  isAuthLoading: true,
  isAuth: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authenticateSuccess(
      state,
      action: PayloadAction<{ email: string; userId: string }>,
    ) {
      state.isAuth = true;
      state.isAuthLoading = false;
      state.email = action.payload.email;
      state.userId = action.payload.userId;
    },
  },
});

const userReducer = userSlice.reducer;
export default userReducer;

export const userActions = userSlice.actions;

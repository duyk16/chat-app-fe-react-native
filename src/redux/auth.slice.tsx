import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import { AxiosError } from 'axios';

import Api, { setBearerToken } from '../services/api';
import { REFRESH_TOKEN } from '../config/keyStorage';

export interface AuthState {
  userId: string;
  email: string;
  displayName: string;
  accessToken: string;
  refreshToken: string;

  isAuthLoading: boolean;
  isAuth: boolean;

  isLoginLoading: boolean;
  loginError: string;

  isSignUpLoading: boolean;
  signUpSuccess: string;
  signUpError: string;
}

const initialState: AuthState = {
  userId: '',
  email: '',
  displayName: '',
  accessToken: '',
  refreshToken: '',

  isAuthLoading: true,
  isAuth: false,

  isLoginLoading: false,
  loginError: '',

  isSignUpLoading: false,
  signUpSuccess: '',
  signUpError: '',
};

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Authenticate
     */
    authenticateSuccess(state, action: PayloadAction<GetTokenResponse>) {
      state.isAuth = true;
      state.isAuthLoading = false;

      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
      state.userId = action.payload.id;
      state.displayName = action.payload.displayName;
    },
    authenticateFail(state) {
      state.isAuth = false;
      state.isAuthLoading = false;
    },

    /**
     * Login
     */
    startLogin(state) {
      state.isLoginLoading = true;
    },

    loginSuccess(state, action: PayloadAction<LoginReponse>) {
      state.isAuth = true;
      state.isLoginLoading = false;

      state.email = action.payload.email;
      state.userId = action.payload.id;
      state.displayName = action.payload.displayName;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    loginFail(state, action: PayloadAction<string>) {
      state.isLoginLoading = false;
      state.loginError = action.payload;
    },

    /**
     * Logout
     */
    logout(state) {
      return initialState;
    },

    /**
     * Sign Up
     */
    startSignUp(state) {
      state.isSignUpLoading = true;
    },
    signUpSuccess(state, action: PayloadAction<string>) {
      state.isSignUpLoading = false;
      state.signUpSuccess = 'Sign up success';
    },
    signUpFail(state, action: PayloadAction<string>) {
      state.isSignUpLoading = false;
      state.signUpError = action.payload;
    },
    resetSignUp(state) {
      state.signUpError = '';
      state.signUpSuccess = '';
      state.isSignUpLoading = false;
    },
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;

/**
 * Authenticate with Refresh token
 */
interface GetTokenResponse {
  id: string;
  email: string;
  displayName: string;
  accessToken: string;
}

export const authenticateWithRefreshToken = () => async (
  dispatch: Dispatch,
) => {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);

    const response = await Api.post<GetTokenResponse>('/auth/access-token', {
      refreshToken,
    });

    // Set token header
    setBearerToken(response.data.accessToken);

    dispatch(authActions.authenticateSuccess(response.data));
  } catch (error) {
    dispatch(authActions.authenticateFail());
  }
};

/**
 * Login
 */
interface LoginReponse {
  id: string;
  email: string;
  displayName: string;
  accessToken: string;
  refreshToken: string;
}

export const loginWithCredentials = (email: string, password: string) => async (
  dispatch: Dispatch,
) => {
  dispatch(authActions.startLogin());
  try {
    let response = await Api.post<LoginReponse>('/auth/sign-in', {
      email,
      password,
    });

    // Store refresh token
    await AsyncStorage.setItem(REFRESH_TOKEN, response.data.refreshToken);

    // Set token header
    setBearerToken(response.data.accessToken);

    dispatch(authActions.loginSuccess(response.data));
  } catch (error) {
    if (error.isAxiosError) {
      let axiosError = error as AxiosError;
      console.log(error.response.data);
      if (axiosError.response?.status === 401) {
        dispatch(authActions.loginFail(axiosError.response?.data.message));
        return;
      } else if (axiosError.response?.status === 400) {
        console.log(axiosError.response?.data.message[0]);
        dispatch(authActions.loginFail(axiosError.response?.data.message[0]));
      }
    }

    dispatch(authActions.loginFail(''));
    throw error;
  }
};

/**
 * Logout
 */
export const getLogout = () => async (dispatch: Dispatch) => {
  await AsyncStorage.removeItem(REFRESH_TOKEN);
  dispatch(authActions.logout());
};

/**
 * Sign Up
 */

interface SignUpResponse {
  _id: string;
  createdAt: string;
}
export const signUpWithCreateCredentails = (
  email: string,
  password: string,
  displayName: string,
) => async (dispatch: Dispatch) => {
  dispatch(authActions.startSignUp());

  try {
    const response = await Api.post('/auth/sign-up', {
      email,
      password,
      displayName,
    });
    dispatch(authActions.signUpSuccess(response.data._id));
  } catch (error) {
    console.log(error);
    if (error.isAxiosError) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 409) {
        dispatch(authActions.signUpFail('Email was register before'));
        return;
      }

      if (axiosError.response?.status === 400) {
        dispatch(authActions.signUpFail(axiosError.response.data.message[0]));
        return;
      }
    }

    dispatch(authActions.signUpFail('An error occur'));
  }
};

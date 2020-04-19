import React, { useEffect, FC } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { StackActionHelpers } from '@react-navigation/routers/lib/typescript/src/StackRouter';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../redux';
import {
  AuthState,
  authenticateWithRefreshToken,
} from '../../redux/auth.slice';
import { RootStackParamList } from '../../Navigator';

type P = {
  navigation: StackActionHelpers<RootStackParamList> & NavigationProp<any>;
};

const Auth: FC<P> = (props) => {
  /**
   * Redux
   */
  const { isAuth, isAuthLoading } = useSelector<RootState, AuthState>(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  /**
   * Effect
   */
  useEffect(() => {
    dispatch(authenticateWithRefreshToken());
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuth) {
        props.navigation.replace('Conversation');
      } else {
        props.navigation.replace('Login', {});
      }
    }
  }, [isAuthLoading]);

  return (
    <View style={styles.container}>
      <Text>Authenticating...</Text>
      <ActivityIndicator size="large" style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    marginVertical: 15,
  },
});

export default Auth;

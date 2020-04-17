import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackActionHelpers } from '@react-navigation/routers/lib/typescript/src/StackRouter';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../../redux';
import {
  AuthState,
  authenticateWithRefreshToken,
} from '../../redux/auth.slice';

const Auth = () => {
  const { isAuth, isAuthLoading } = useSelector<RootState, AuthState>(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  const navigation: StackActionHelpers<any> = useNavigation<any>();

  useEffect(() => {
    dispatch(authenticateWithRefreshToken());
  }, []);

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuth) {
        navigation.replace('Conversation');
      } else {
        navigation.replace('Login');
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

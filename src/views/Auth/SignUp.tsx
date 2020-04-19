import React, { Component, useState, useEffect, FC, useRef } from 'react';
import {
  Container,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  View,
  Content,
  Toast,
} from 'native-base';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { StackActionHelpers } from '@react-navigation/routers/lib/typescript/src/StackRouter';
import { NavigationProp } from '@react-navigation/native';

import PerfectCenter from '../../components/layout/PerfectCenter';
import {
  AuthState,
  signUpWithCreateCredentails,
  authActions,
} from '../../redux/auth.slice';
import { RootState } from '../../redux';
import { RootStackParamList } from '../../Navigator';

export interface CreateCredentails {
  email: string;
  password: string;
  displayName: string;
}

type P = {
  navigation: StackActionHelpers<RootStackParamList> &
    NavigationProp<RootStackParamList>;
};

const SignUp: FC<P> = (props) => {
  /**
   * Redux
   */
  const { isSignUpLoading, signUpError, signUpSuccess } = useSelector<
    RootState,
    AuthState
  >((state) => state.auth);
  const dispatch = useDispatch();

  /**
   * State
   */
  const [createCredentials, setCreateCredentails] = useState<CreateCredentails>(
    {
      email: '',
      password: '',
      displayName: '',
    },
  );

  /**
   * Variables and functions
   */
  const displayNameRef: any = useRef(null);
  const passwordRef: any = useRef(null);

  const onInputChange = (field: keyof CreateCredentails) => (text: string) => {
    setCreateCredentails({
      ...createCredentials,
      [field]: text,
    });
  };

  const onSubmit = () => {
    const { email, password, displayName } = createCredentials;
    dispatch(signUpWithCreateCredentails(email, password, displayName));
  };

  /**
   * Effect
   */
  useEffect(() => {
    if (!signUpSuccess) return;

    Toast.show({
      type: 'success',
      text: signUpSuccess,
      position: 'top',
      style: { marginTop: 20 },
    });

    dispatch(authActions.resetSignUp());
    props.navigation.navigate('Login', { email: createCredentials.email });
  }, [signUpSuccess]);

  useEffect(() => {
    if (!signUpError) return;

    Toast.show({
      type: 'warning',
      text: signUpError,
      position: 'top',
      style: { marginTop: 20 },
    });

    dispatch(authActions.resetSignUp());
  }, [signUpError]);

  return (
    <Container>
      <Content>
        <View style={{ height: 200 }}></View>
        <PerfectCenter style={styles.contentView}>
          <View style={styles.contentView}>
            <Form style={{ width: '100%' }}>
              <Item stackedLabel>
                <Label>Email</Label>
                <Input
                  value={createCredentials.email}
                  textContentType="emailAddress"
                  autoCompleteType="email"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    displayNameRef.current._root.focus();
                  }}
                  onChangeText={onInputChange('email')}
                />
              </Item>
              <Item stackedLabel>
                <Label>Display name</Label>
                <Input
                  ref={displayNameRef}
                  value={createCredentials.displayName}
                  textContentType="emailAddress"
                  autoCompleteType="email"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    passwordRef.current._root.focus();
                  }}
                  onChangeText={onInputChange('displayName')}
                />
              </Item>
              <Item stackedLabel last>
                <Label>Password</Label>
                <Input
                  ref={passwordRef}
                  value={createCredentials.password}
                  onChangeText={onInputChange('password')}
                  textContentType="password"
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
              </Item>
            </Form>
          </View>
          <View style={styles.actionView}>
            <Button block info onPress={onSubmit} disabled={isSignUpLoading}>
              {isSignUpLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text>Sign Up</Text>
              )}
            </Button>
          </View>
          <TouchableOpacity
            disabled={isSignUpLoading}
            onPress={() => {
              props.navigation.navigate('Login');
            }}>
            <Text style={styles.signUpText}>Back to login</Text>
          </TouchableOpacity>
        </PerfectCenter>
      </Content>
    </Container>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  contentView: {
    width: '100%',
    paddingHorizontal: 15,
  },
  actionView: {
    paddingHorizontal: 10,
    width: '100%',
    marginVertical: 15,
  },
  signUpText: {
    fontSize: 14,
    color: 'rgb(11, 96, 255)',
  },
});

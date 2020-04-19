import React, { useState, useEffect, FC, useRef } from 'react';
import {
  Container,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  View,
  Toast,
  Content,
} from 'native-base';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { StackActionHelpers } from '@react-navigation/routers/lib/typescript/src/StackRouter';

import PerfectCenter from '../../components/layout/PerfectCenter';
import { loginWithCredentials, AuthState } from '../../redux/auth.slice';
import { RootState } from '../../redux';
import { RootStackParamList } from '../../Navigator';

export interface Credentails {
  email: string;
  password: string;
}

type P = {
  navigation: StackActionHelpers<RootStackParamList> &
    NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, 'Login'>;
};

const Login: FC<P> = (props) => {
  /**
   * Redux
   */
  const { isLoginLoading, loginError, isAuth } = useSelector<
    RootState,
    AuthState
  >((state) => state.auth);
  const dispatch = useDispatch();

  /**
   * State
   */
  const [credentials, setCredentails] = useState<Credentails>({
    email: '',
    password: '',
  });

  /**
   * Variables and functions
   */
  const passwordRef: any = useRef(null);
  const onInputChange = (field: keyof Credentails) => (text: string) => {
    setCredentails({
      ...credentials,
      [field]: text,
    });
  };

  const onSubmit = () => {
    dispatch(loginWithCredentials(credentials.email, credentials.password));
  };

  /**
   * Effect
   */
  useEffect(() => {
    if (!loginError) return;
    Toast.show({
      text: loginError,
      buttonText: 'Okay',
      type: 'warning',
      style: { marginTop: 20 },
      position: 'top',
    });
  }, [loginError]);

  useEffect(() => {
    if (!isAuth) return;
    props.navigation.replace('Conversation');
    Toast.show({
      text: 'Login success',
      // buttonText: 'Okay',
      type: 'success',
      style: { marginTop: 20 },
      position: 'top',
    });
  }, [isAuth]);

  useEffect(() => {
    if (props.route.params.email) {
      setCredentails({
        ...credentials,
        email: props.route.params.email,
      });
    }
  }, []);

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
                  value={credentials.email}
                  textContentType="emailAddress"
                  autoCompleteType="email"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    passwordRef.current._root.focus();
                  }}
                  onChangeText={onInputChange('email')}
                />
              </Item>
              <Item stackedLabel last>
                <Label>Password</Label>
                <Input
                  ref={passwordRef}
                  value={credentials.password}
                  onChangeText={onInputChange('password')}
                  textContentType="password"
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
              </Item>
            </Form>
          </View>
          <View style={styles.actionView}>
            <Button block info onPress={onSubmit} disabled={isLoginLoading}>
              {isLoginLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text>Login</Text>
              )}
            </Button>
          </View>
          <TouchableOpacity
            disabled={isLoginLoading}
            onPress={() => {
              props.navigation.navigate('SignUp');
            }}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </PerfectCenter>
      </Content>
    </Container>
  );
};

export default Login;

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

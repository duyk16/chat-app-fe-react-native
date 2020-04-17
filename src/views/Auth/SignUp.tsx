import React, { Component, useState, useEffect } from 'react';
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
} from 'native-base';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import PerfectCenter from '../../components/layout/PerfectCenter';
import { AuthState } from '../../redux/auth.slice';
import { RootState } from '../../redux';

export interface CreateCredentails {
  email: string;
  password: string;
  displayName: string;
}

const SignUp = () => {
  const dispatch = useDispatch();
  const { isLoginLoading, loginError } = useSelector<RootState, AuthState>(
    (state) => state.auth,
  );

  const [createCredentials, setCreateCredentails] = useState<CreateCredentails>(
    {
      email: '',
      password: '',
      displayName: '',
    },
  );

  const onInputChange = (field: keyof CreateCredentails) => (text: string) => {
    setCreateCredentails({
      ...createCredentials,
      [field]: text,
    });
  };

  const onSubmit = () => {};

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
                  onChangeText={onInputChange('email')}
                />
              </Item>
              <Item stackedLabel>
                <Label>Display name</Label>
                <Input
                  value={createCredentials.displayName}
                  textContentType="emailAddress"
                  autoCompleteType="email"
                  autoCapitalize="none"
                  onChangeText={onInputChange('displayName')}
                />
              </Item>
              <Item stackedLabel last>
                <Label>Password</Label>
                <Input
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
            <Button block info onPress={onSubmit} disabled={isLoginLoading}>
              {isLoginLoading ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text>Login</Text>
              )}
            </Button>
          </View>
          <TouchableOpacity disabled={isLoginLoading}>
            <Text style={styles.signUpText}>Sign Up</Text>
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
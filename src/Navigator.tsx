import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Auth from './views/Auth/Auth';
import Chat from './views/Chat/Chat';
import Login from './views/Auth/Login';
import Conversation from './views/Conversation/Conversation';
import Users from './views/Users/Users';
import SignUp from './views/Auth/SignUp';

export type RootStackParamList = {
  Auth: undefined;
  Conversation: undefined;
  Login: {
    email?: string;
  };
  SignUp: undefined;
  Chat: { conversationId: string; name: string };
  Users: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{ gestureEnabled: true }}>
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Conversation"
          component={Conversation}
          options={{}}
        />
        <Stack.Screen name="Users" component={Users} options={{}} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => ({ title: route.params.name })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;

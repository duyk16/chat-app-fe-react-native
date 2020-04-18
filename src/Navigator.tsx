import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Auth from './views/Auth/Auth';
import Login from './views/Auth/Login';
import Conversation from './views/Conversation/Conversation';
import Chat from './views/Chat/Chat';

export type RootStackParamList = {
  Auth: undefined;
  Conversation: undefined;
  Login: undefined;
  Chat: { conversationId: string };
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
          name="Conversation"
          component={Conversation}
          options={{}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Chat" component={Chat} options={{}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;

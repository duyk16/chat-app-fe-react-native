import React, { useEffect, FC, useLayoutEffect } from 'react';
import { ScrollView, Button, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import { StackActionHelpers } from '@react-navigation/routers/lib/typescript/src/StackRouter';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {
  loadConversations,
  ConversationState,
} from '../../redux/conversation.slice';

import Container from '../../components/layout/Container';
import ConversationItem from './ConversationItem';
import { RootState } from '../../redux';
import { AuthState, getLogout } from '../../redux/auth.slice';
import { RootStackParamList } from '../../Navigator';
import { FlatList } from 'react-native-gesture-handler';

type P = {
  navigation: StackActionHelpers<RootStackParamList> &
    NavigationProp<RootStackParamList>;
};

const Conversation: FC<P> = (props) => {
  /**
   * Redux
   */
  const { conversations } = useSelector<RootState, ConversationState>(
    (state) => state.conversation,
  );
  const { isAuth, userId, displayName } = useSelector<RootState, AuthState>(
    (state) => state.auth,
  );
  const dispatch = useDispatch();

  /**
   * Effect
   */
  useEffect(() => {
    dispatch(loadConversations());
  }, []);

  useEffect(() => {
    if (!isAuth) {
      props.navigation.replace('Login');
    }
  }, [isAuth]);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerLeft: () => (
        <Button
          onPress={() => {
            dispatch(getLogout());
          }}
          title="Sign Out"
        />
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => console.log('Oke')}
          style={{ paddingHorizontal: 15 }}>
          <AntDesign name="plus" size={24} />
        </TouchableOpacity>
      ),
    });
  }, [props.navigation]);

  return (
    <Container>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const user = item.members.find((user) => user._id != userId);
          const username = user ? user.displayName : displayName;
          return (
            <ConversationItem
              username={username}
              time={new Date(item.updatedAt)}
              onPress={() => {
                props.navigation.push('Chat', { conversationId: item._id });
              }}
            />
          );
        }}
      />
    </Container>
  );
};

export default Conversation;

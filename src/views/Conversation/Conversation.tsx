import React, { useEffect, FC, useLayoutEffect } from 'react';
import { ScrollView, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';
import { StackActionHelpers } from '@react-navigation/routers/lib/typescript/src/StackRouter';

import {
  loadConversations,
  ConversationState,
} from '../../redux/conversation.slice';

import Container from '../../components/layout/Container';
import ConversationItem from './ConversationItem';
import { RootState } from '../../redux';
import { AuthState, authActions, getLogout } from '../../redux/auth.slice';
import { RootStackParamList } from '../../Navigator';

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
  const { isAuth } = useSelector<RootState, AuthState>((state) => state.auth);
  const dispatch = useDispatch();

  /**
   * State
   */
  const { userId } = useSelector<RootState, AuthState>((state) => state.auth);

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
      headerRight: () => (
        <Button
          onPress={() => {
            dispatch(getLogout());
          }}
          title="Sign Out"
        />
      ),
    });
  }, [props.navigation]);

  return (
    <Container>
      <ScrollView>
        {conversations.map((item) => {
          return (
            <ConversationItem
              key={item._id}
              username={
                item.members.find((user) => user._id != userId)!.displayName
              }
              time={new Date(item.updatedAt)}
              onPress={() => {
                props.navigation.push('Chat', { conversationId: item._id });
              }}
            />
          );
        })}
      </ScrollView>
    </Container>
  );
};

export default Conversation;

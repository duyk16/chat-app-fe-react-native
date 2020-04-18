import React, { useState, FC, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useSelector, useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';

import { RootState } from '../../redux';
import { AuthState } from '../../redux/auth.slice';
import { ConversationState } from '../../redux/conversation.slice';
import {
  getMessages,
  chatActions,
  ChatState,
  sendMessage,
  MessageResponse,
} from '../../redux/chat.slice';
import { RootStackParamList } from '../../Navigator';
import Container from '../../components/layout/Container';
import socket from '../../services/socket';

type P = {
  route: RouteProp<RootStackParamList, 'Chat'>;
};

const Chat: FC<P> = (props) => {
  /**
   * Redux
   */
  const { userId, displayName, accessToken } = useSelector<
    RootState,
    AuthState
  >((state) => state.auth);

  const { conversations } = useSelector<RootState, ConversationState>(
    (state) => state.conversation,
  );

  const { messages } = useSelector<RootState, ChatState>((state) => state.chat);

  const dispatch = useDispatch();

  /**
   * Variables
   */
  const { conversationId } = props.route.params;

  /**
   * Functions
   */
  const onSend = (newMessages: IMessage[] = []) => {
    const message = newMessages[0];
    dispatch(sendMessage(conversationId, message));
  };

  /**
   * Effect
   */
  useEffect(() => {
    const members = conversations.find((item) => item._id === conversationId)!
      .members;

    dispatch(chatActions.setConversationMembers(members));
    dispatch(getMessages(conversationId));

    /**
     * Socket
     */
    const onMessage = (message: MessageResponse) => {
      if (message.owner !== userId) dispatch(chatActions.addMessage(message));
    };
    socket().on('MESSAGE', onMessage);

    const onSocketConnected = () => {
      socket().emit('AUTH', accessToken, (data: any) => {
        console.log('AUTHENTICATION', data);
      });
    };
    socket().on('connect', onSocketConnected);

    return () => {
      socket().removeEventListener('MESSAGE', onMessage);
      socket().removeEventListener('connect', onSocketConnected);
    };
  }, []);

  return (
    <Container white>
      <GiftedChat
        renderLoading={() => <ActivityIndicator size="large" />}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{ _id: userId, name: displayName }}
      />
    </Container>
  );
};

export default Chat;

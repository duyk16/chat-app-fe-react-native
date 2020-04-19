import React, { FC, useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { StackActionHelpers } from '@react-navigation/routers/lib/typescript/src/StackRouter';
import { FlatList } from 'react-native';

import { RootStackParamList } from '../../Navigator';
import Container from '../../components/layout/Container';
import ConversationItem from '../../components/list/ConversationItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux';
import {
  UserState,
  getUserList,
  createConversation,
  userActions,
} from '../../redux/user.slice';

type P = {
  navigation: StackActionHelpers<RootStackParamList> &
    NavigationProp<RootStackParamList>;
};

const Users: FC<P> = (props) => {
  /**
   * Redux
   */
  const { users, targetConversation } = useSelector<RootState, UserState>(
    (state) => state.user,
  );
  const dispatch = useDispatch();

  /**
   * Variables and functions
   */
  let targetName: string;
  const onPressItem = (userId: string, displayName: string) => {
    targetName = displayName;
    dispatch(createConversation(userId));
  };

  /**
   * Effect
   */
  useEffect(() => {
    dispatch(getUserList());
  }, []);

  useEffect(() => {
    if (!targetConversation) return;
    props.navigation.replace('Chat', {
      conversationId: targetConversation,
      name: targetName,
    });
    dispatch(userActions.clearState());
  }, [targetConversation]);

  return (
    <Container>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          return (
            <ConversationItem
              mainText={item.displayName}
              subText={item.email}
              onPress={() => {
                onPressItem(item._id, item.displayName);
              }}
            />
          );
        }}
      />
    </Container>
  );
};

export default Users;

import React from 'react';
import { ScrollView } from 'react-native';

import Container from '../../components/layout/Container';
import ConversationItem from './ConversationItem';

const Conversation = () => {
  return (
    <Container>
      <ScrollView>
        <ConversationItem username="Dany Duck" time={new Date(1587087768047)} />
        <ConversationItem username="Dany Duck" time={new Date(1587087768047)} />
        <ConversationItem username="Dany Duck" time={new Date(1587087768047)} />
      </ScrollView>
    </Container>
  );
};

export default Conversation;

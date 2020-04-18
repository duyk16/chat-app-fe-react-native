import React, { FC } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import Avatar from '../../components/avatar/Avatar';
import { timeSince } from '../../utils/time';

type P = {
  username: string;
  time: Date;
};

const ConversationItem: FC<P & TouchableOpacityProps> = (props) => {
  return (
    <TouchableOpacity style={styles.container} {...props}>
      <View style={styles.left}>
        <Avatar style={{ marginRight: 20 }} />
        <Text style={styles.textName}>{props.username}</Text>
      </View>
      <View>
        <Text style={styles.textTime}>{timeSince(props.time.getTime())}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationItem;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#e9e9e9',
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textName: {
    fontWeight: '400',
    fontSize: 18,
  },
  textTime: {
    fontStyle: 'italic',
    fontSize: 11,
    fontWeight: '300',
  },
});

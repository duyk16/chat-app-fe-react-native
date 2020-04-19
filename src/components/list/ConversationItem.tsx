import React, { FC } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import Avatar from '../avatar/Avatar';
import { timeSince } from '../../utils/time';

type P = {
  mainText: string;
  subText?: string;
  time?: Date;
};

const ConversationItem: FC<P & TouchableOpacityProps> = (props) => {
  return (
    <TouchableOpacity style={styles.container} {...props}>
      <View style={styles.left}>
        <Avatar style={{ marginRight: 20 }} />
        <View>
          <Text style={styles.textName}>{props.mainText}</Text>
          {props.subText && <Text>{props.subText}</Text>}
        </View>
      </View>
      <View>
        <Text style={styles.textTime}>
          {props.time ? timeSince(props.time.getTime()) : ''}
        </Text>
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

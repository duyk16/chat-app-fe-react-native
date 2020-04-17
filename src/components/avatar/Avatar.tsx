import React from 'react';
import { View, Image, ViewStyle } from 'react-native';

type P = {
  style?: ViewStyle;
};

const Avatar = (props: P) => {
  return (
    <View style={{ width: 50, height: 50, ...props.style }}>
      <Image
        style={{ width: '100%', height: '100%', borderRadius: 50 }}
        source={{ uri: 'https://i.pravatar.cc/300' }}
      />
    </View>
  );
};

export default Avatar;

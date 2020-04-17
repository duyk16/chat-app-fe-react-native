import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

type P = {
  style?: ViewStyle;
};

const PerfectCenter: FC<P> = (p) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...p.style,
      }}>
      {p.children}
    </View>
  );
};

export default PerfectCenter;

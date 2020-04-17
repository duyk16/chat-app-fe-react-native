import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

type P = {
  perfectCenter?: boolean;
  justifyCenter?: boolean;
  alignCenter?: boolean;
  style?: ViewStyle;
};

const Container: FC<P> = (p) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent:
          p.perfectCenter || p.justifyCenter ? 'center' : undefined,
        alignItems: p.perfectCenter || p.alignCenter ? 'center' : undefined,
        ...p.style,
      }}>
      {p.children}
    </View>
  );
};

export default Container;

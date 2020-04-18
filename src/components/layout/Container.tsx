import React, { FC } from 'react';
import { View, ViewStyle } from 'react-native';

type P = {
  perfectCenter?: boolean;
  justifyCenter?: boolean;
  alignCenter?: boolean;
  style?: ViewStyle;
  white?: boolean;
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
        backgroundColor: p.white ? '#fff' : undefined,
      }}>
      {p.children}
    </View>
  );
};

export default Container;

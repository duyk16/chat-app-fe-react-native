import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { Root } from 'native-base';
import 'react-native-gesture-handler';

import store from './store';
import Navigator from './Navigator';

const App: FC = () => {
  return (
    <Root>
      <Provider store={store}>
        <StatusBar barStyle="dark-content" />
        <Navigator />
      </Provider>
    </Root>
  );
};

export default App;

import React from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

type P = {};

type S = {
  messages: IMessage[];
};

class App extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
    
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
          image:
            'https://cdn2.iconfinder.com/data/icons/social-icons-33/128/Github-512.png',
        },
      ],
    });
  }

  onSend(message: IMessage[] = []) {
    let messages = GiftedChat.append(this.state.messages, message);
    this.setState({ messages });
  }

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        placeholder={'Type a message'}
        onSend={(message) => {
          this.onSend(message);
        }}
        user={{
          _id: 1,
          name: 'React Native 1',
          avatar: 'https://placeimg.com/140/140/any',
        }}
      />
    );
  }
}

export default App;

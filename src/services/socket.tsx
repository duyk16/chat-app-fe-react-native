import io from 'socket.io-client';
import { YellowBox } from 'react-native';

import { SOCKET_HOST_NAME } from '../config/server';

let _socket: SocketIOClient.Socket;

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
]);

function socket(): SocketIOClient.Socket {
  if (!_socket) {
    _socket = io(SOCKET_HOST_NAME, {
      transports: ['websocket'],
    });

    _socket.on('connection', () => {
      console.log('connected');
    });
  }
  return _socket;
}

export default socket;

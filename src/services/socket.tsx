import io from 'socket.io-client';

import { SOCKET_HOST_NAME } from '../config/server';

let _socket: SocketIOClient.Socket;

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

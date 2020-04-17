import io from 'socket.io-client';

const socket = io({
  hostname: 'http://localhost:3001',
  timeout: 10000,
});

export default socket;

import http from 'http';
import { Server, Socket } from 'socket.io';

const webSocket = (server: http.Server) => {
  const io = new Server(server, {
    path: '/chat',
    cors: {
      origin: 'http://localhost:8080',
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('hi');
  });
};

export default webSocket;

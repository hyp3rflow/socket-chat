import http from 'http';
import { Server, Socket } from 'socket.io';

const webSocket = (server: http.Server) => {
  let userCount = 0;

  const io = new Server(server, {
    path: '/chat',
    cors: {
      origin: 'http://localhost:8080',
    },
  });

  io.on('connection', (socket: Socket) => {
    let isUser = false;

    socket.on('login', () => {
      if (isUser) return;
      isUser = true;
      userCount += 1;

      socket.emit('login', { userCount });
      socket.broadcast.emit('new user', { userCount });
    });

    socket.on('disconnect', () => {
      if (isUser) {
        userCount -= 1;
        socket.broadcast.emit('disconnect user', { userCount });
      }
    });

    socket.on('chat', (data) => {
      socket.emit('chat', {
        userName: data.userName,
        chat: data.chat,
      });
      socket.broadcast.emit('chat', {
        userName: data.userName,
        chat: data.chat,
      });
    });
  });
};

export default webSocket;

import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const App: React.FC = () => {
  const socket = io('http://localhost:3000', { path: '/chat' });

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    });
  });

  return <div>hi</div>;
};

export default App;

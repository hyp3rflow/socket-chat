import server from 'app';
import webSocket from 'socket';

const port = process.env.PORT || 3000;

const httpServer = server.listen(port, () => {
  console.log(`Server listening: ${port}`);
});

webSocket(httpServer);

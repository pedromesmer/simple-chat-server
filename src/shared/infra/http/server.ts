import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import cors from 'cors';
import { routes } from './routes';

const app = express();
app.use(routes);
app.use(cors());

const httpServer = http.createServer(app);
const io = new socketio.Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket => {
  const room = socket.handshake.query?.room;
  const name = socket.handshake.query?.name;

  if (room) {
    socket.join(room);
  }
  console.log('new connection: ', name);

  socket.on('message', message => {
    console.log('message: ', message);
    if (room) io.to(room).emit('message', { user: name, message });
  });
});

httpServer.listen(3333, () => {
  console.log(`🚀 Server started on port 3333`);
});

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

const arrayUser: any[] = [];

io.on('connection', socket => {
  const nickname = socket.handshake.query?.nickname;
  const image = socket.handshake.query?.image;

  console.log('new connection: ', nickname);

  socket.emit('allMessages', arrayUser);

  socket.on('message', message => {
    arrayUser.push({
      nickname,
      image,
      message,
    });

    io.emit('message', arrayUser);
  });
});

httpServer.listen(3333, () => {
  console.log(`🚀 Server started on port 3333`);
});

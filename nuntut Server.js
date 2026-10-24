const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get('/', (req, res) => { res.send('Server NUNTIAPP Berjalan!'); });

io.on('connection', (socket) => {
  socket.on('join', (userId) => { socket.join(userId); });
  socket.on('typing', (data) => {
    io.to(data.receiverId).emit('user_typing', { senderId: data.senderId });
  });
  socket.on('call_signal', (data) => {
    io.to(data.receiverId).emit('incoming_call', data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => { console.log(`Server berjalan di port ${PORT}`); });

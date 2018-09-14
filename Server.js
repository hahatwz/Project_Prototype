/////////////////////////add socket live connection//////////////////////////
var express = require('express');
var path = require('path');
// Setup tcp server for nodejs.
const net = require('net');
var temp;
const server1 = net.createServer((c) => {
  //'connection' listener
  console.log('client connected');
    c.on('data', (data) => {
      temp = data.toString();
      //console.log(temp);
    });
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.pipe(c);
});
server1.on('error', (err) => {
  throw err;
});
server1.listen(7088, () => {
  console.log('server bound');
});




//http socket
var gettempapp = express();
var tempserver = require('http').Server(gettempapp);
var io = require('socket.io')(tempserver);
var port = 7089;
gettempapp.use(express.static(path.join(__dirname, "public")));
io.on('connection', (socket) => {
  console.log('new connection made');
  socket.broadcast.emit('temperature is', {
    msg: temp
  });
});

// tempserver.listen(port, () => {
//   console.log("Listening on port " + port);
// });
////////////////
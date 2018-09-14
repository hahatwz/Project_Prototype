var express = require('express');
var path = require('path');


//////////////////////////////////////////////////////////////
// Setup tcp server for nodejs.
const net = require('net');
var temp;
const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected');
    c.on('data', (data) => {
      temp = data.toString();
      console.log(temp);
    });
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(7088, () => {
  console.log('server bound');
});


///////////////////////////////////////////////////////
//http socket
//var gettempapp = express();
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


let timerId = null,
    sockets = new Set();

//This example emits to individual sockets (track by sockets Set above).
//Could also add sockets to a "room" as well using socket.join('roomId')
//https://socket.io/docs/server-api/#socket-join-room-callback

app.use(express.static(__dirname + '/dist')); 

io.on('connection', socket => {

  sockets.add(socket);
  console.log(`Socket ${socket.id} added`);

  if (!timerId) {
    startTimer();
  }

  socket.on('clientdata', data => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    console.log(`Deleting socket: ${socket.id}`);
    sockets.delete(socket);
    console.log(`Remaining sockets: ${sockets.size}`);
  });

});

function startTimer() {
  //Simulate stock data received by the server that needs 
  //to be pushed to clients
  timerId = setInterval(() => {
    if (!sockets.size) {
      clearInterval(timerId);
      timerId = null;
      console.log(`Timer stopped`);
    }
    let value = temp;
    //See comment above about using a "room" to emit to an entire
    //group of sockets if appropriate for your scenario
    //This example tracks each socket and emits to each one
    for (const s of sockets) {
      console.log(`Emitting value: ${value}`);
      s.emit('data', { data: value });
    }

  }, 1000);
}

http.listen(7089);
console.log('Visit http://localhost:7089 in your browser');

////////////////

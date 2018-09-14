var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/database');


var api = require('./routes/api');
var app = express();


mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection succesful'))
  .catch((err) => console.error(err));

app.use(passport.initialize());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/users', express.static(path.join(__dirname, 'dist')));
app.use('/api', api);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// /////////////////////////add socket live connection//////////////////////////

// // Setup tcp server for nodejs.
// const net = require('net');
// var temp;
// const server1 = net.createServer((c) => {
//   //'connection' listener
//   console.log('client connected');
//     c.on('data', (data) => {
//       temp = data.toString();
//       //console.log(temp);
//     });
//   c.on('end', () => {
//     console.log('client disconnected');
//   });
//   c.pipe(c);
// });
// server1.on('error', (err) => {
//   throw err;
// });
// server1.listen(7088, () => {
//   console.log('server bound');
// });




// //http socket
// var gettempapp = express();
// var tempserver = require('http').Server(gettempapp);
// var io = require('socket.io')(tempserver);
// var port = 7089;
// gettempapp.use(express.static(path.join(__dirname, "public")));
// io.on('connection', (socket) => {
//   console.log('new connection made');
//   socket.broadcast.emit('temperature is', {
//     msg: temp
//   });
// });

// // tempserver.listen(port, () => {
// //   console.log("Listening on port " + port);
// // });
// ////////////////
module.exports = app;
// module.exports = gettempapp;


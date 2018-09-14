var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/user");
//var UserProfile = require("../models/UserProfile");
//var temp = require("../models/temp")

// // Setup tcp server for nodejs.
// const net = require('net');
// const server = net.createServer((c) => {
//   // 'connection' listener
//   console.log('client connected');
//     c.on('data', (data) => {
//       temp = data.toString();
//       console.log(temp);
//     });
//   c.on('end', () => {
//     console.log('client disconnected');
//   });
//   c.pipe(c);
// });
// server.on('error', (err) => {
//   throw err;
// });
// server.listen(7088, () => {
//   console.log('server bound');
// });

var UProfile = new User();
var UPid = new String();

router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      area: req.body.area,
      longtitude: req.body.longtitude,
      latitude: req.body.latitude,
      phvalue:req.body.phvalue
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;
    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret);
          UProfile.username = user.username;
          UPid = user._id;
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.post('/update', function(req, res) {
  console.log(req)
  User.findByIdAndUpdate(UPid,
    {
      username: req.body.username,
      password: req.body.password,
      name: req.body.name,
      area: req.body.area,
      longtitude: req.body.longtitude,
      latitude: req.body.latitude,
      phvalue:req.body.phvalue
    }, { new: true },
    function(err, user) {
    if (err) 
      res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
    else
    {
      res.json({success: true});
      console.log(res);
    }
  });
});

router.get('/signup', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    User.findOne({username: UProfile.username},
      function (err, ups) {
      if (err) return next(err);
      //console.log(UProfile.username);
      console.log(ups);
      res.json(ups);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});



//get temperature data
router.get('/temps', function(req, res) {
  console.log('pushing temp data');
  res.json(temp)
});


getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;
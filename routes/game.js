var express = require('express');
var router = express.Router();

var init = function(io) {

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('game', { title: 'Space' });
  });

  io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
      socket.broadcast.emit('chat message', msg);
    });
    socket.on('disconnect', function(e) {
      console.log('user disconnected:', e);
    });
  });

  return router;
};


module.exports = init;

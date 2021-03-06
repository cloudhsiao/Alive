var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var email = require('emailjs');
var run = require('./app.js');
var config = require('./config/config.js');

var errorRate = 0.0;
var errerAlert = 0.30;
var mailServer = email.server.connect({
  user: "freeman@zhenhai.com.tw",
  password: "*********",
  host: "www.zhenhai.com.tw",
  ssl: false
});

var tmpIpArray;
var tmpDailySum;

app.use(express.static(__dirname + '/javascript'));
app.use(express.static(__dirname + '/images'));

app.get('/common.js', function(req, res) {
  res.send('function getHostName() { return "' + config.site.host + '"; } function getMapFile() { return "' + config.site.map + '"; } function getBranchName() { return "' + config.site.alias + '"; }');
});

app.get('/pic', function(req, res) {
  res.sendFile(__dirname + '/boxStatusPic.html');
});

io.on('connection', function(socket) {
  console.log('user connected');

  socket.on('boxStatusPic', function(msg) {
    if(tmpIpArray != null && tmpDailySum != null) {
      io.emit('PING', JSON.stringify(tmpIpArray));
      io.emit('SUM', JSON.stringify(tmpDailySum));
    }
  });
/*
  socket.on('errorRate', function(msg) {
    errorRate = msg;
    console.log("errorRate: " + errorRate);
  });
*/

  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});

http.listen(config.port, function() {
  console.log('server started and listening on port ' + config.port + ' ...');
});

run.start(function(ipArray, dailySum) {
  tmpIpArray = ipArray;
  tmpDailySum = dailySum;
  io.emit('PING', JSON.stringify(ipArray));
  io.emit('SUM', JSON.stringify(dailySum));
});

function sendMail(msg) {
  mailServer.send(
    {
      text:msg,
      from: "ZhenHai 機台存活率檢查 <freeman@zhenhai.com.tw>",
      to: "z_h_e_n_h_a_i@mailinator.com",
      subject: "台容 謝崗廠 機台存活率過低"
    },
    function(err, msg) {
      console.log("err: " + err || msg);
    }
  );
}

function checkErrorRate() {
  if (errorRate > errerAlert) {
    sendMail("出錯機台 " + (errorRate* 100) + " %");
  }
}

//setInterval(checkErrorRate, 300000);
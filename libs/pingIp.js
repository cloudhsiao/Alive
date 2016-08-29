var ping = require('net-ping');
var config = require('../config/config.js');

var options = {
  networkProtocol: ping.NetworkProtocol.IPv4,
  packetSize: 12,
  retries: 0,
  sessionId: (process.pid % 65535),
  timeout: 500,
  ttl: 128
};

var session = ping.createSession(options);
var pingSet = []; // where are all IPs that we need to ping.

function checkAlive() {
  for(var ip in pingSet) {
    setTimeout(pingHost(ip), 1000);
  }
}

function pingHost(host) {
  session.pingHost(host, function(err, ip) {
    if (err) {
      pingSet[ip] = 1;
    } else {
      pingSet[ip] = 0;
    }
  });
}

function getAliveResult(errorTimes) {
  var failedIp = [];
  for(var ip in pingSet) {
    if(pingSet[ip] >= errorTimes) {
      var data = {};
      data['IP'] = ip;
      // only return failed IPs.
      failedIp.push(data);
    }
  }
  process.send(failedIp);
}

for (var i = 0; i < config.site.machine.length; i++) {
  if (config.site.machine[i].IP !== '') {
    pingSet.push(config.site.machine[i].IP);
  }
}

setInterval(checkAlive, config.checkAlive.pingTime);
setInterval(getAliveResult, config.checkAlive.checkTime, config.checkAlive.errorTimes);
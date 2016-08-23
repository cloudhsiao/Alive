var ping = require('net-ping');
var config = require('../config/ping.js').ping;
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

function initIpArray(ipRange, upper, lower, ignoreIPs) {
  for(var x = parseInt(lower); x <= parseInt(upper); x++ ) {
    pingSet[ipRange + x] = 0;
  }
  for(var x = 0; x < ignoreIPs.length; x++) {
    delete pingSet[ipRange + ignoreIPs[x]]
  }
}

function checkAlive() {
  console.log('checkAlive');
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

initIpArray(config.ipRange[0].range, config.ipRange[0].upper, config.ipRange[0].lower, config.ipRange[0].ignore);
initIpArray(config.ipRange[1].range, config.ipRange[1].upper, config.ipRange[1].lower, config.ipRange[1].ignore);
setInterval(checkAlive, config.pingTime);
setInterval(getAliveResult, config.checkTime, config.errorTimes);
var ping = require('net-ping');
var config_ping = require('../config/ping.js').ping;
var config_range = require('../config/general.js').site;

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

for (var i = 0; i < config_range.ipRange.length; i++) {
  initIpArray(config_range.ipRange[i].range, config_range.ipRange[i].upper, config_range.ipRange[i].lower, config_range.ipRange[i].ignore);
}
setInterval(checkAlive, config_ping.pingTime);
setInterval(getAliveResult, config_ping.checkTime, config_ping.errorTimes);
var config = require('../../config/config.js');
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
  pingSet[host] = 0;
  var t = Math.floor(Math.random() * (100 - 1 + 1) + 1);
  if (t < 30) {
    pingSet[host] = 1;
  }
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

checkAlive();
getAliveResult(10000, 1);
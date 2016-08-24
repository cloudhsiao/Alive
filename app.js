var flow = require('nimble');
var fs = require('fs');
var child_process = require('child_process');
var config = require('./config/general.js').site;

var env = process.env.NODE_ENV || 'dev';
var pingIp;
var database;

if (env === 'dev') {
  console.log('server is running in dev mode');
  pingIp = child_process.fork('./libs/dev/pingIp.js');
  database = require('./libs/dev/database.js');
} else {
  console.log('server is running in production mode');
  pingIp = child_process.fork('./libs/pingIp.js');
  database = require('./libs/database.js');
}

var ipArray = [];
var dailySum = {};

exports.start = function(cb) {
  flow.series([
    // 1. first of all, we read all ip from the file.
    function(callback) {
      fs.readFile(config.ipMappingFile, 'utf8', function(err, data) {
        if(err) {
          console.log('read file err: ' + err);
          throw err;
        }
        ipArray = JSON.parse(data);
        callback();
      });
    },
    // 2. get ping data.
    function(callback) {
      pingIp.on('message', function(m) {
        var idx;
        for(idx = 0; idx < ipArray.length; idx++) {
          var data = m.filter(function(obj) {
            return obj.IP === ipArray[idx].IP;
          });
          if (ipArray[idx].IP !== '') {
            if (data.length > 0) { // if have data! it must be NOT alive -> 0 (false)
              ipArray[idx].ALIVE = 0;
            } else {
              ipArray[idx].ALIVE = 1;
            }
          } else {
            ipArray[idx].ALIVE = 0;
          }
        }
      });
      callback();
    },
    // 3. get machine status from database
    function(callback) {
      database.getStatus(function(result) {
        var idx;
        for(idx = 0; idx < ipArray.length; idx++) {
          var data = result.filter(function(obj) {
            return obj.ID === ipArray[idx].ID;
          });
          if(data.length > 0) {
            ipArray[idx].STATUS = data[0].STATUS;
          }
        }
        callback();
      });
    },
    // 4. get produce quantity from database
    function(callback) {
      database.getQty(function(result) {
        var idx;
        for(idx = 0; idx < ipArray.length; idx++) {
          var data = result.filter(function(obj) {
            return obj.ID === ipArray[idx].ID;
          });
          if(data.length > 0) {
            ipArray[idx].QTY = data[0].QTY;
          }
        }
        callback();
      });
    }, 
    // 5. get daily summary from database
    function(callback) {
      database.getDailySum(function(data) {
        dailySum = data;
        callback();
      });
    },
    // final. return to main function
    function(callback) {
      cb(ipArray, dailySum);
      callback();
    }
  ]);
}

var flow = require('nimble');
var child_process = require('child_process');
var config = require('./config/general.js').general;
var readIp = require('./libs/readIp.js');

//var pingIp = child_process.fork('./libs/pingIp.js');
//var dbStatus = require('./libs/dbStatus.js');
//var dbQty = require('./libs/dbQty.js');
//var dbDaily = require('./libs/dbDaily.js');

var pingIp = child_process.fork('./libs/pingFakeIp.js');
var dbStatus = require('./libs/testLib.js');
var dbQty = require('./libs/testLib.js');
var dbDaily = require('./libs/testLib.js');

var ipArray = []; // data from ipMapping.json
var dailySum = {};

function getSTATUS(cb) {
  dbStatus.getStatus(function(result) {
    var idx;
    for(idx = 0; idx < ipArray.length; idx++) {
      var data = result.filter(function(obj) {
        return obj.ID === ipArray[idx].ID;
      });
      if(data.length > 0) {
        ipArray[idx].STATUS = data[0].STATUS;
      }
    }
    cb();
  });
}

function getQTY(cb) {
  dbQty.getQty(function(result) {
    var idx;
    for(idx = 0; idx < ipArray.length; idx++) {
      var data = result.filter(function(obj) {
        return obj.ID === ipArray[idx].ID;
      });
      if(data.length > 0) {
        ipArray[idx].QTY = data[0].QTY;
        //console.log('QTY: ' + ipArray[idx].ID + '-->' + ipArray[idx].QTY);
      }
    }
    cb();
  });
}

exports.start = function(cb) {
  flow.series([
    // 1. first of all, we read all ip from the file.
    function(callback) {
      readIp.read(config.ipMappingFile, function(data){
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

        flow.series([
          function(callback) {
            getSTATUS(function() {
              callback();
            });
          },
          function(callback) {
            getQTY(function() {
              callback();
            });
          }, 
          function(callback) {
            dbDaily.getDailySum(function(data) {
              dailySum = data;
              callback();
            });
          },
          function(callback) {
            cb(ipArray, dailySum);
            callback();
          }
        ]);
      });
      callback();
    }
  ]);
}

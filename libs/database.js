var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var assert = require('assert');
var objectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/zhenhai';

var today;
const BIG = "16 - 18";
const MEDIUM = "10 - 12.5";
const SMALL = "5 - 8";
const TYPE_E = 1;
const TYPE_G = 2;
const TYPE_A = 3;
const TYPE_A4 = 4;
const TYPE_TC = 5;

exports.getDailySum = function queryDatabase(cb) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    var collection = db.collection('daily');
    var data = {};

    var BIG_E = 0;
    var BIG_G = 0;
    var BIG_A = 0;
    var BIG_A4 = 0;
    var BIG_TC = 0;

    var MEDIUM_E = 0;
    var MEDIUM_G = 0;
    var MEDIUM_A = 0;
    var MEDIUM_A4 = 0;
    var MEDIUM_TC = 0;

    var SMALL_E = 0;
    var SMALL_G = 0;
    var SMALL_A = 0;
    var SMALL_A4 = 0;
    var SMALL_TC = 0;
    
    if (moment().format('H') < 7) {
      today = moment().subtract(1, 'day').format('YYYY-MM-DD');
    } else {
      today = moment().format('YYYY-MM-DD');
    }

    var stream = collection.find({"shiftDate": today}).stream();

    stream.on("data", function(item) {
      if (item.capacityRange === BIG && item.machineType === TYPE_E) {
        BIG_E += item.count_qty;
      } else if (item.capacityRange === BIG && item.machineType === TYPE_G) {
        BIG_G += item.count_qty;
      } else if (item.capacityRange === BIG && item.machineType === TYPE_A) {
        BIG_A += item.count_qty;
      } else if (item.capacityRange === BIG && item.machineType === TYPE_A4) {
        BIG_A4 += item.count_qty;
      } else if (item.capacityRange === BIG && item.machineType === TYPE_TC) {
        BIG_TC += item.count_qty;
      } else if (item.capacityRange === MEDIUM && item.machineType === TYPE_E) {
        MEDIUM_E += item.count_qty;
      } else if (item.capacityRange === MEDIUM && item.machineType === TYPE_G) {
        MEDIUM_G += item.count_qty;
      } else if (item.capacityRange === MEDIUM && item.machineType === TYPE_A) {
        MEDIUM_A += item.count_qty;
      } else if (item.capacityRange === MEDIUM && item.machineType === TYPE_A4) {
        MEDIUM_A4 += item.count_qty;
      } else if (item.capacityRange === MEDIUM && item.machineType === TYPE_TC) {
        MEDIUM_TC += item.count_qty;
      } else if (item.capacityRange === SMALL && item.machineType === TYPE_E) {
        SMALL_E += item.count_qty;
      } else if (item.capacityRange === SMALL && item.machineType === TYPE_G) {
        SMALL_G += item.count_qty;
      } else if (item.capacityRange === SMALL && item.machineType === TYPE_A) {
        SMALL_A += item.count_qty;
      } else if (item.capacityRange === SMALL && item.machineType === TYPE_A4) {
        SMALL_A4 += item.count_qty;
      } else if (item.capacityRange === SMALL && item.machineType === TYPE_TC) {
        SMALL_TC += item.count_qty;
      }
    });

    stream.on("end", function() {
      db.close();
  
      data["BIG_E"] = BIG_E;
      data["BIG_G"] = BIG_G;
      data["BIG_A"] = BIG_A;
      data["BIG_A4"] = BIG_A4;
      data["BIG_TC"] = BIG_TC;
  
      data["MEDIUM_E"] = MEDIUM_E;
      data["MEDIUM_G"] = MEDIUM_G;
      data["MEDIUM_A"] = MEDIUM_A;
      data["MEDIUM_A4"] = MEDIUM_A4;
      data["MEDIUM_TC"] = MEDIUM_TC;
  
      data["SMALL_E"] = SMALL_E;
      data["SMALL_G"] = SMALL_G;
      data["SMALL_A"] = SMALL_A;
      data["SMALL_A4"] = SMALL_A4;
      data["SMALL_TC"] = SMALL_TC;

      cb(data);
    });
  });
}

exports.getQty = function (callback) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    var collection = db.collection('dailyMachineCount');
    var result = [];
    var stream = collection.find({'insertDate':moment().format('YYYY-MM-DD')}).stream();

    stream.on("data", function(doc) {
      var item = {};
      item["ID"] = doc.machineID;
      item["QTY"] = doc.count_qty;
      result.push(item);
    });

    stream.on("end", function() {
      db.close();
      callback(result);
    });
  });
};

exports.getStatus = function (callback) {
  var now = new Date();
  var time = ( new Date( now.getFullYear() + '-' + (now.getMonth()+1) + '-' + now.getDate() ) ).getTime() / 1000;

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);

    var collection = db.collection('machineStatus');
    var result = [];
    var stream = collection.find({'lastUpdateTime': { '$gte': time}}).stream();

    stream.on("data", function(doc) {
      var item = {};
      item["ID"] = doc.machineID;
      item["STATUS"] = doc.status;
      result.push(item);
    });

    stream.on("end", function() {
      db.close();
      callback(result);
    });
  });
};

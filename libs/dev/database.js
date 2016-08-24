var fs = require('fs');
var config = require('../../config/general.js').site;

exports.getStatus = function (cb) {  
  fs.readFile(config.ipMappingFile, 'utf8', function parseJson(err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    var result = [];
    for (var i = 0; i < obj.length; i++) {
      var item = {};
      item["ID"] = obj[i].ID;

      var s = Math.floor(Math.random() * (100 - 0 + 1) + 1);
      if (s > 30) {
        item["STATUS"] = '01';
      } else {
        var t = Math.floor(Math.random() * 3 + 1);
        if (t === 1) {
          item["STATUS"] = '05';
        } else if (t === 2) {
          item["STATUS"] = '09';
        } else {
          item["STATUS"] = '10';
        }
      }
      result.push(item);
    }
    cb(result);
  });
};

exports.getQty = function (cb) {
  fs.readFile(config.ipMappingFile, 'utf8', function parseJson(err, data) {
    if (err) throw err;
    var obj = JSON.parse(data);
    var result = [];
    for (var i = 0; i < obj.length; i++) {
      var item = {};
      item["ID"] = obj[i].ID;

      var qty = Math.floor(Math.random() * (999 - 100 + 1) + 100);
      item["QTY"] = qty > 950 ? 0 : qty;

      result.push(item);
    }
    cb(result);
  });  
};

exports.getDailySum = function(callback) {
  var data = {};
  data["BIG_E"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["BIG_G"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["BIG_A"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["BIG_A4"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["BIG_TC"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;

  data["MEDIUM_E"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["MEDIUM_G"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["MEDIUM_A"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["MEDIUM_A4"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["MEDIUM_TC"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;

  data["SMALL_E"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["SMALL_G"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["SMALL_A"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["SMALL_A4"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;
  data["SMALL_TC"] = Math.floor(Math.random() * (999 - 100 + 1) + 100);;

  callback(data);   
};
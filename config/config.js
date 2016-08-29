var fs = require('fs');

var config = module.exports;
var file = process.env.CONFIG;

config.site = JSON.parse(fs.readFileSync(file));
config.port = process.env.PORT || 8000;
config.checkAlive = {
  pingTime: 60000,
  checkTime: 90000,
  errorTimes: 1,
};
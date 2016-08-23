var ini = require('node-ini');

module.exports = function(callback){
  ini.parse('./config/config.ini', function(err, data) {
    if(err) {
      console.log('abc');
      console.log(err)
    } else {
      callback(data);
    }
  });
};

var config = module.exports;

config.ping = {
  pingTime: 60000,
  checkTime: 90000,
  errorTimes: 1,
  ipRange:[
    {
      range: '192.168.10.',
      upper: 252,
      lower: 1,
      ignore: [226, 70]
    },
    {
      range: '192.168.20.',
      upper: 88,
      lower: 1,
      ignore: [0]
    }
  ]
};
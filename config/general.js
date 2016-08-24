var config = module.exports;

var dg = {
  host: '221.4.141.146',
  branch: 'sz',
  ipMappingFile: './config/ipMapping_dg.json',
  factoryMapFile: '/optimized_dg_3.svg',
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
    },
  ]
};

var sz = {
  host: '218.4.250.102',
  branch: 'sz',
  ipMappingFile: './config/ipMapping_sz.json',
  factoryMapFile: '/optimized_sz_2.svg',
  ipRange: [
    {
      range: '192.168.200.',
      upper: 164,
      lower: 1,
      ignore: [0]
    },
  ]
};

config.site = sz;
config.port = 8000;
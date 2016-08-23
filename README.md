# Alive
The code has merged both Taicon DG & SZ. 

## How
open `config/general.js` and change following settings to fit the right site.

Setting for Taicon-DG:

```
config.general = {
  host: '221.4.141.146',
  branch: 'dg',
  ipMappingFile: './config/ipMapping_dg.json',
  factoryMapFile: '/optimized_dg_3.svg'
};
```

Setting for Taicon-SZ:

```
config.general = {
  host: '218.4.250.102',
  branch: 'sz',
  ipMappingFile: './config/ipMapping_sz.json',
  factoryMapFile: '/optimized_sz_2.svg'
};
```

## License
Code release under the MIT license.
# Alive
The code has merged both Taicon DG & SZ. 

## Configuration
Open `config/config.js` and change settings as the following format to fit the right site.

```json
{
  "alias": "dg",
  "host": "221.4.141.xxx",
  "map": "/optimized_dg_3.svg",
  "machine": [
    {
      "ID": "A01",
      "MODEL": "CS-204K", 
      "IP": "192.168.10.xxx", 
      "QTY": 0,  
      "ALIVE": 0, 
      "SIZE": "xxx", 
      "TYPE": 3,
      "NOTE": "xxx", 
      "STATUS": "", 
    }
  ]
}    
```

- alias: branch name, ex `dg` or `sz`.
- host: the host of dashboard.
- map: the locaton of the fatory map.
- machine: the machine list.
  - The following field are pre-defined:
    - `ID`
    - `MODEL`
    - `IP`
    - `SIZE`
    - `NOTE`
    - `TYPE`:
      - 1: 加締
      - 2: 組立
      - 3: 老化
      - 4: 加工
      - 5: 包裝
  - The following field will check online:
    - `QTY`
    - `ALIVE`
    - `STATUS`


## Launch the server
The site will launch as `dev` mode by defult, but you can switch to `production` easily.

```bash
$ sudo NODE_ENV=production CONFIG=./config/dg.json node server.js
```

## License
Code release under the MIT license.
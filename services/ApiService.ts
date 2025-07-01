import { IApi } from '@interfaces/IApi';
import { IData } from '@interfaces/IData';

class ApiService implements IApi {
  getInfo() {
    //区别开 MPA 和 SPA
    // window.localStorage.get('info');
    // if(){}..
    return new Promise<IData>((resolve) => {
      resolve({
        item: '我是后台数据🌺',
        result: {
          "_type": "TransactionReceipt",
          "blockHash": "0x0c500509e34c972bccda139da303870c4380b6ab4caf33529cc1cc2f9d54f9c6",
          "blockNumber": 8645703,
          "contractAddress": null,
          "cumulativeGasUsed": "3270153",
          "from": "0xF2CD60A8ff5eeAB6D693C4883094469Ad3d4De1a",
          "gasPrice": "1500009007",
          "blobGasUsed": null,
          "blobGasPrice": null,
          "gasUsed": "21000",
          "hash": "0xb1fb58c13b0afd90501f73cd5e33267714346772e5a5f33d678409c3e9c4ff71",
          "index": 32,
          "logs": [],
          "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          "status": 1,
          "to": "0x0000000000000000000000000000000000000000"
        },
      });
    });
  }
}
export default ApiService;

import { Api, JsonRpc } from 'eosjs';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';

const endpoint = 'https://api.eosnewyork.io'; // kylin
const network = {
  blockchain: 'eos',
  protocol: 'https',
  host: 'nodes.get-scatter.com',
  port: 443,
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
};

class EosService {
  constructor(dappName, contractAccount) {
    this.dappName = dappName;
    this.contractAccount = contractAccount;
    ScatterJS.plugins(new ScatterEOS());
    this.rpc = new JsonRpc(endpoint);
    window.ScatterJS = null;
  }

  connect = async () => {
    await ScatterJS.scatter.connect(this.dappName).then(connected => {
      if (!connected) return console.log('Failed to connect with Scatter!');
      this.scatter = ScatterJS.scatter;
    });

    await this.scatter.getIdentity({ accounts: [network] }).then(() => {
      this.account = this.scatter.identity.accounts.find(
        e => e.blockchain === 'eos'
      );
    });

    if (this.account === null) return false;

    console.log('Connected');
    return true;
  };

  transaction = async (action, data) => {
    this.api = this.scatter.eos(network, Api, { rpc: this.rpc });

    const resultWithConfig = await this.api.transact(
      {
        actions: [
          {
            account: this.contractAccount,
            name: action,
            authorization: [
              {
                actor: this.account.name,
                permission: this.account.authority
              }
            ],
            data: {
              ...data
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    );
    console.log(resultWithConfig);
    return true;
  };
}

export default EosService;

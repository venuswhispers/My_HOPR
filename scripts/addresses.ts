export type Networks = 'mainnet' | 'morden' | 'ropsten' | 'rinkeby' | 'goerli' | 'kovan' | 'private' | 'solkol' | 'xdai'

export const HOPR_TOKEN: { [key in Networks]: string } = {
  mainnet: undefined,
  morden: undefined,
  ropsten: undefined,
  rinkeby: undefined,
  goerli: undefined,
  kovan: '0xDD78859E6714D045a31Caa0075C1523f6E08fFe1',
  private: '0x66DB78F4ADD912a6Cb92b672Dfa09028ecc3085E',
  solkol: undefined,
  xdai: '0xbb6de194eb4547993ce53eeE0226638fc9aE0C60',
}

export const HOPR_CHANNELS: { [key in Networks]: string } = {
  mainnet: undefined,
  morden: undefined,
  ropsten: undefined,
  rinkeby: undefined,
  goerli: undefined,
  kovan: '0x6eCe0EC9E5F408e664ACc397A8Ac7241841c6658',
  private: '0x902602174a9cEb452f60c09043BE5EBC52096200',
  solkol: undefined,
  xdai: '0xf4Ff7E5bf2cC7eF89196c8086982F6f5Ec502685',
}

export const HOPR_MINTER: { [key in Networks]: string } = {
  mainnet: undefined,
  morden: undefined,
  ropsten: undefined,
  rinkeby: undefined,
  goerli: undefined,
  kovan: undefined,
  private: '0x0a67180CF519aDF27f1FD32F7255bBa00B536FC6',
  solkol: undefined,
  xdai: '',
}

export const HOPR_FAUCET: { [key in Networks]: string } = {
  mainnet: undefined,
  morden: undefined,
  ropsten: undefined,
  rinkeby: undefined,
  goerli: undefined,
  kovan: '0x034869aaF67F09296303D2d42dceEc53F4F04533',
  private: '0x6c97048D67c39ADCe38bbB228fc1bA415fc8f096',
  solkol: undefined,
  xdai: '0xcD1049D51adB3187FB9cc9f786cab99F57eCa4D1',
}

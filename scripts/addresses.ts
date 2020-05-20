export type Networks = 'mainnet' | 'morden' | 'ropsten' | 'rinkeby' | 'goerli' | 'kovan' | 'private'

export const HOPR_TOKEN: { [key in Networks]: string } = {
  mainnet: undefined,
  morden: undefined,
  ropsten: undefined,
  rinkeby: undefined,
  goerli: undefined,
  kovan: '0xEC0e1Fc209225CAcA789E6ff8de916484Ed4B3Fd',
  private: '0x66DB78F4ADD912a6Cb92b672Dfa09028ecc3085E',
}

export const HOPR_CHANNELS: { [key in Networks]: string } = {
  mainnet: undefined,
  morden: undefined,
  ropsten: undefined,
  rinkeby: undefined,
  goerli: undefined,
  kovan: '0x41135a6F96e9128107886012F0ea38f8C76475B3',
  private: '0x902602174a9cEb452f60c09043BE5EBC52096200',
}

export const HOPR_MINTER: { [key in Networks]: string } = {
  mainnet: undefined,
  morden: undefined,
  ropsten: undefined,
  rinkeby: undefined,
  goerli: undefined,
  kovan: '0x1565D14C3A2D9984a13008Abdb33a7044b9ad2E0',
  private: '0x0a67180CF519aDF27f1FD32F7255bBa00B536FC6',
}

export const HOPR_FAUCET: { [key in Networks]: string } = {
  mainnet: undefined,
  morden: undefined,
  ropsten: undefined,
  rinkeby: undefined,
  goerli: undefined,
  kovan: '0xD0331e4F21d5CC27c82b1663c8Ead0A9a646b050',
  private: '0x6c97048D67c39ADCe38bbB228fc1bA415fc8f096',
}

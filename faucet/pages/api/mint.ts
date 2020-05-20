import { IncomingMessage, ServerResponse } from 'http'
import { parse as parseUrl } from 'url'
import { HOPR_FAUCET as addresses, Networks } from '@hoprnet/hopr-ethereum/scripts/addresses'
import networksConfig from '@hoprnet/hopr-ethereum/truffle-networks.json'
import HoprFaucetAbi from '@hoprnet/hopr-ethereum/build/extracted/abis/HoprFaucet.json'
import Web3 from 'web3'

const { isAddress, toChecksumAddress, toWei } = Web3.utils
const { PRIVATE_KEY, INFURA } = process.env

export default async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const query = parseUrl(req.url, true).query as {
      network: Networks
      address: string
    }

    // validate network
    const network = query.network
    if (typeof addresses[network] === 'undefined') {
      res.statusCode = 400
      res.end('Invalid network.')
      return
    }

    // validate address
    let address = query.address
    if (!isAddress(address)) {
      res.statusCode = 400
      res.end('Invalid address.')
      return
    }
    // checksum address
    address = toChecksumAddress(address)

    const isPrivate = network === 'private'

    // infura url
    const url = isPrivate
      ? `ws://${networksConfig.development.host}:${networksConfig.development.port}`
      : `https://${network}.infura.io/v3/${INFURA}`

    // initialize web3
    const web3 = new Web3(url)
    const hoprFaucet = new web3.eth.Contract(HoprFaucetAbi as any, addresses[network])

    const tx = hoprFaucet.methods.mint(address, toWei('100', 'ether'))

    const signedTransaction = await web3.eth.accounts.signTransaction(
      {
        to: hoprFaucet.options.address,
        data: tx.encodeABI(),
        gas: 50e3,
      },
      PRIVATE_KEY
    )

    // we don't need to wait for the receipt
    web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ transactionHash: signedTransaction.transactionHash }))
  } catch (err) {
    console.error(err)

    res.statusCode = 500
    res.end('Unexpected error.')
  }
}

const HoprToken = artifacts.require('HoprToken')
const HoprFaucet = artifacts.require('HoprFaucet')

module.exports = async (deployer) => {
  const token = await HoprToken.deployed()

  await deployer.deploy(HoprFaucet, token.address)
}

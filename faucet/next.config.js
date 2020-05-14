// we need to transpile local modules
const withTM = require('next-transpile-modules')(['@hoprnet/hopr-ethereum'])

module.exports = withTM()

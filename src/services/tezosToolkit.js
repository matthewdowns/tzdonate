const { TezosToolkit } = require('@taquito/taquito');

const tezosToolkit = new TezosToolkit('https://api.tez.ie/rpc/edonet');

module.exports = tezosToolkit;
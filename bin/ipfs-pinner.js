#!/usr/bin/env node
'use strict';

global.fetch = require('node-fetch');
const fs = require('fs');
const url = require('url');
const infura = new (require('ipfs-deploy/src/pinners/infura'))({ projectId: process.env.INFURA_PROJECT_ID, projectSecret: process.env.INFURA_PROJECT_SECRET });
const yargs = require('yargs');
const toURL = (cid) => url.format({
  hostname: 'cloudflare-ipfs.com',
  pathname: '/ipfs/' + cid.string,
  protocol: 'https:'
});

(async () => {
  const [ filename ] = yargs.argv._;
  if (!filename) throw Error('must supply filename');
  const { cid } = await infura.ipfs.add({
    content: fs.readFileSync(filename)
  }, { pin: true });
  console.log(toURL(cid));
})().catch((err) => console.error(err));

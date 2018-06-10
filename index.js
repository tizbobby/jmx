'use strict';

const electron = require('electron');
const fs = require('fsxt');
const path = require('path');
const Module = require('module');
const { unzip } = require('cross-unzip');
const asar = require('asar');

const debug = true;

function aunzip(a, b) {
  return new Promise((resolve, reject) => {
    unzip(a, b, err => {
      if (err) reject(err);
      else resolve();
    })
  });
}

(async () => {
  console.log(process.argv);
  const root = path.join(__dirname, 'javout');
  
  if (!debug) {
    await aunzip(path.join(__dirname, 'JAVMax-Setup-1.0.0.exe'), path.join(__dirname, '_temp_out'));
    console.log('finished first extract');

    await aunzip(path.join(__dirname, '_temp_out', 'javmax-1.0.0-full.nupkg'), path.join(__dirname, '_temp_out2'));
    console.log('finished 2nd extract');

    asar.extractAll(path.join(__dirname, '_temp_out2', 'lib', 'net45', 'resources', 'app.asar'), root);
  }
  process.chdir(root);

  // this is important to prevent freeze crash
  electron.app.getAppPath = () => root;

  // fetch package.json inside app asar
  const pkg = require(path.join(root, 'package.json'));

  // patch module
  require('./shared').patchModule(`js${path.sep}main.js`, content => 
    content.replace(/'width':0x44c,'height':0x2bc/, '$&,webPreferences:{preload:' + JSON.stringify(path.resolve(__dirname, 'preload.js')) + '}')
  );

  console.log('rooting', pkg.main);
  //require(path.join(root, pkg.main));
  Module._load(path.join(root, pkg.main), null, true);

})().catch((...e) => {
  console.error('failed', ...e);
  process.exit(420);
});
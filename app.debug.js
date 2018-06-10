const sget = require('./javout/node_modules/simple-get');
Object.keys(sget).forEach(e => {
  const original = sget[e];
  sget[e] = (...args) => {
    console.log(e, 'request', ...args);
    original(...args);
  };
});

const origGetEndpointURL = window.getEndpointURL;
window.getEndpointURL = (...args) => {
  console.log('getEndpointURL', ...args);
  return origGetEndpointURL(...args);
};

const origGetAPIData = window.getAPIData;
window.getAPIData = (...args) => {
  console.log('getAPIData', ...args);
  return origGetAPIData(...args);
};
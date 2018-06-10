'use strict';

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const electron = require('electron');

console.log('preload accessed');

Handlebars.registerHelper('replace', function(find, replace, options) {
  const regex = new RegExp(escapeRegex(find), 'g');
  return options.fn(this).replace(regex, replace);
});

function escapeRegex(string) {
  return string.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
}

Handlebars.registerHelper('iife', function(options) {
  return `;(() => {
${options.fn(this)}
})();`;
});

Handlebars.registerHelper('absolute', function(targetPath, options) {
  return JSON.stringify(path.resolve(__dirname, targetPath));
});

Handlebars.registerHelper('relative', function(targetPath, options) {
  return JSON.stringify(path.relative(electron.remote.app.getAppPath(), path.resolve(__dirname, targetPath)));
});

const template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname, 'app.template.js'), 'utf8'));

// patch module
require('./shared').patchModule(`js${path.sep}app.js`, content => template({raw: content}));

process.once('loaded', () => {
  console.log('preload procloaded');
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('typeof jquery', typeof $);
  });
});

function indexHtmlRelative(...paths) {
  return path.relative(process.cwd(), path.join(__dirname, ...paths));
}
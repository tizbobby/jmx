const fs = require('fsxt');
const Module = require('module');
const { clipboard } = require('electron');

const sep = exports.sep = '<<>>';

exports.patchModule = (pattern, callback) => {
  const oldLoader = Module._extensions['.js'];
  Module._extensions['.js'] = (module, filename) => {
    let content = fs.readFileSync(filename, 'utf8');

    if (filename.endsWith(pattern)) {
      console.log('[Injector] patching', pattern);
      
      content = callback(content);
      
      if (!content) throw new Error('you fucked up with ' + callback);
      
      Module._extensions['.js'] = oldLoader;
    }

    return module._compile(content, filename);
  };
};

exports.getBaseContextMenu = onHide => ({
  callback(key, options) {
    const separator = key.indexOf(sep);
    const index = key.slice(0, separator);
    const stream = JSON.parse(key.slice(separator+sep.length));
    //alert('index: ' + index + '\nstream: ' + stream);
    
    exports.copyStream(stream.provider, stream.provider_stream_id, stream.title);
  },
  events: {
    hide: onHide
  },
  items: {
    '!!!!dummy1': {name: 'Click on an entry to copy it', disabled: true},
    'dummy2': {name: 'Loading...', disabled: true},
  }
});

exports.addStreamItem = (contextData, stream, index) => {
  if (stream.provider != 'openload') {
    console.warn('unsupported stream:', stream.provider, stream.provider_stream_id);
    return;//skip
  }
  
  // index for order, then separator and all the data
  // yep this is dirty as hell
  contextData.items[pad(index, 4) + sep + JSON.stringify(stream)] = {
    name: `[${stream.provider}] ${stream.title} (${humanFileSize(stream.filesize, true)})`
  };
};

exports.copyStream = (provider, streamId, title) => {
  if (provider == 'openload') {
    clipboard.writeText('https://openload.co/embed/' + streamId);
  } else {
    console.warn('no provider', provider);
  }
  $.toast('Copied "' + title + '" to clipboard');
};

exports.setupContextMenu = selector => {
  $.contextMenu({
    selector,
    trigger: 'none',
    build: ($trigger, e) => {
      e.preventDefault();

      // pull a build from the trigger
      return $trigger.data('contextData');
    }
  });
};

function humanFileSize(bytes, si) {
  var thresh = si ? 1000 : 1024;
  if(Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  var units = si
    ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
    : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
  var u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while(Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1)+' '+units[u];
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
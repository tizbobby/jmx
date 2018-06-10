window.getEndpointURL = undefined;
window.getAPIData = undefined;

{{#replace ',getAPIData,getEndpointURL,' ','}}
{{{raw}}}
{{/replace}}

{{#iife}}
  function injectCSS(location) {
    const head = document.head;
    const style = document.createElement('link');

    style.rel = 'stylesheet';
    style.href = location;

    head.appendChild(style);
  }
  
  injectCSS({{{relative 'jquery.contextMenu.css'}}});
  injectCSS({{{relative 'jquery.toast.min.css'}}});
  injectCSS({{{relative 'download-button.css'}}});
  
  require({{{absolute 'jquery-toast-patched.min.js'}}});
  require({{{absolute 'jquery-contextmenu-patched.js'}}});
  require({{{absolute 'jquery-livequery-patched.js'}}});
{{/iife}}
require({{{absolute 'app.debug.js'}}});
require({{{absolute 'app.contextMenu.js'}}});
require({{{absolute 'app.video-download.js'}}});

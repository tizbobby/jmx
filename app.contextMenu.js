const { getBaseContextMenu, addStreamItem, setupContextMenu } = require('./shared.js');
const { mouseX, mouseY } = require('./shared-mouse.js');

$('#content').livequery('.griditem.video', function(elem) {
  const $this = $(elem);
  
  elem.addEventListener('mouseup', e => {
    if (e.which != 3) return;
    
    let visible = true;
    
    const contextData = getBaseContextMenu(options => {
      visible = false;
    });
    
    $this.data('contextData', contextData);
    const position = {
      x: mouseX(), 
      y: mouseY()
    };
    $this.contextMenu(position);
    
    const endpoint = JSON.parse($this.attr('data-endpoint')); // don't use $this.data since we are mutating
    endpoint.lang = 'en';
    
    getAPIData(endpoint, (err, result) => {
      if (!visible) return; // don't tamper with $this.data even just to cleanup, we don't want a race condition with the next event listener
      delete contextData.items.dummy2;
      
      result.streams.forEach((stream, index) => {
        addStreamItem(contextData, stream, index);
      });
      
      $this.contextMenu("hide");
      $this.contextMenu(position);
    });
    
  });
});

// setup context menu
setupContextMenu('.griditem.video');
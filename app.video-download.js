const { getBaseContextMenu, addStreamItem, setupContextMenu, copyStream } = require('./shared.js');
const { mouseX, mouseY } = require('./shared-mouse.js');

$('#content').livequery('.video-info', function(elem) {
  console.log('added', elem);
  const $this = $(elem).find('.watch-button-container');
  $this.on('click', '.download-button.download', function() {
    const stream = $this.data('streams')[0];
    copyStream(stream.provider, stream.provider_stream_id, stream.title);
  });
  $this.on('click', '.download-button.select', function() {
    const contextData = getBaseContextMenu(options => {
      visible = false;
    });
    
    $this.data('contextData', contextData);
    const position = {
      x: mouseX(), 
      y: mouseY()
    };
    delete contextData.items.dummy2;
      
    $this.data('streams').forEach((stream, index) => {
      addStreamItem(contextData, stream, index);
    });

    $this.contextMenu(position);
  });
  $this.append(`
<div class="download-button-container">
  <div class="download-button download">Download</div>
  <div class="download-button select">
    <i class="material-icons">keyboard_arrow_down</i>
  </div>
</div>`);
});

setupContextMenu('.watch-button-container');
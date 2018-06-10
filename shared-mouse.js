let mouseX = -1;
let mouseY = -1;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);

function onMouseUpdate(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

exports.mouseX = () => mouseX;
exports.mouseY = () => mouseY;
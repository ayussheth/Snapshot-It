// Define variables
const selection = document.querySelector('#snapshotArea .selection');
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let isDragging = false;

// Handle mouse down event
function handleMouseDown(event) {
  startX = event.pageX - selection.offsetLeft;
  startY = event.pageY - selection.offsetTop;
  isDragging = true;
}

// Handle mouse move event
function handleMouseMove(event) {
  if (isDragging) {
    endX = event.pageX - selection.offsetLeft;
    endY = event.pageY - selection.offsetTop;
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    selection.style.width = width + 'px';
    selection.style.height = height + 'px';
    selection.style.left = left + 'px';
    selection.style.top = top + 'px';
  }
}

// Handle mouse up event
function handleMouseUp(event) {
  isDragging = false;
}

// Handle snapshot button click event
function handleSnapshotButtonClick() {
  chrome.tabs.captureVisibleTab(function(screenshotUrl) {
    const image = new Image();
    image.src = screenshotUrl;
    image.onload = function() {
      const canvas = document.createElement('canvas');
      canvas.width = selection.offsetWidth;
      canvas.height = selection.offsetHeight;
      const context = canvas.getContext('2d');
      context.drawImage(image, selection.offsetLeft, selection.offsetTop, selection.offsetWidth, selection.offsetHeight, 0, 0, selection.offsetWidth, selection.offsetHeight);
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'snapshot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  });
}

// Attach event listeners
const snapshotBtn = document.getElementById('snapshotBtn');
snapshotBtn.addEventListener('click', handleSnapshotButtonClick);
selection.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);

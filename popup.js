// Define variables
var selection = document.querySelector('#snapshotArea .selection');
var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;
var isDragging = false;

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
    var width = Math.abs(endX - startX);
    var height = Math.abs(endY - startY);
    var left = Math.min(startX, endX);
    var top = Math.min(startY, endY);
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
    var image = new Image();
    image.src = screenshotUrl;
    image.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = selection.offsetWidth;
      canvas.height = selection.offsetHeight;
      var context = canvas.getContext('2d');
      context.drawImage(image, selection.offsetLeft, selection.offsetTop, selection.offsetWidth, selection.offsetHeight, 0, 0, selection.offsetWidth, selection.offsetHeight);
      var link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'snapshot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  });
}

// Attach event listeners
document.getElementById('snapshotBtn')
selection.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mouseup', handleMouseUp);
document.getElementById('snapshotBtn').addEventListener('click', handleSnapshotButtonClick);

function print() {
  appendMessage('screen.orientation.onchange = ' + screen.orientation.onchange);
}

function loop() {
  print();
  setTimeout(loop, 2000);
}

/**
 * append message to debug message window
 * @param {string} message A message string
 */
function appendMessage(message) {
  var dw = document.getElementById('debugmessage');
  dw.innerHTML += '\n' + JSON.stringify(message);
}


function init() {
  loop();
  screen.orientation.onchange = function(e) {
    console.log("screen.orientation.onchange");
  };
}



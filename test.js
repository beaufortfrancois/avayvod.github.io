function printDefaultRequest() {
  appendMessage('defaultRequest = ' + navigator.presentation.defaultRequest);
  if (navigator.presentation.defaultRequest)
    appendMessage('defaultRequest.onsessionconnect = ' + navigator.presentation.defaultRequest.onsessionconnect);
}

function defaultRequestLoop() {
  printDefaultRequest();
  setTimeout(defaultRequestLoop, 1000);
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
  defaultRequestLoop();
  navigator.presentation.defaultRequest = new PresentationRequest("foo");
  navigator.presentation.defaultRequest.onsessionconnect = function(e) {
    console.log("defaultRequest.onsessionconnect");
  };
}



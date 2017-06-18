const {ipcRenderer} = require('electron');
const ipc = ipcRenderer;

$(document).ready(function() {
  console.log('Document Ready');

	document.ondragover = document.ondrop = (ev) => {
	  ev.preventDefault()
	}

	document.body.ondrop = (ev) => {
	  ipc.send('drop', ev.dataTransfer.files[0].path);
	  ev.preventDefault()
	}
});

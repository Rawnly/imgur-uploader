const path = require('path');
const fs = require('fs');

const {Menu, app, ipcMain, BrowserWindow, shell, dialog} = require('electron');
const got = require('got');
const notify = require('electron-main-notification');


const join = path.join;
const dock = app.dock;
const ipc = ipcMain;

let mainWindow = "";

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		width: 400,
		height: 400,
		resizable: false,
		fullscreenable: false,
		maximizable: false,
		titleBarStyle: 'hiddenInset',
		show: false,
		webPreferences: {
			webSecurity: false
		}
	});

	mainWindow.loadURL('file://' + join(__dirname, 'app', 'index.html'));

	mainWindow.on('ready-to-show', (e) => {
		mainWindow.show()
	})


	ipc.on('drop', (e, item) => {
		const filename = parseFilename(getFilename(item));
		const pathToFile = item;

		fs.readFile(pathToFile, (err, data) => {
			const args = {
				title: filename,
				name: filename,
				image: new Buffer(data, 'binary').toString('base64')
			};

			got('https://api.imgur.com/3/image', {
				method: 'POST',
				json: true,
				body: args,
				headers: {
				 'Authorization': `Client-ID 67f0f72978a1369`
				}
			}).then(({body}) => {
				const info = body.data;
				app.dock.bounce();
				notify('Upload completed', {
					body: 'Click to open in the web'
				}, () => {
					shell.openExternal(info.link);
				})

			}).catch(e => {
				console.log(e);
			})
		});

	})
});


function getFilename(p) {
	return p.split('/')[p.split('/').length - 1]
}

function parseFilename(name) {
	return name.split(' ').join('-');
}

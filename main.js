const {app, BrowserWindow} = require('electron');
const path = require('path');

let mainWindow;


app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit();
    });
});
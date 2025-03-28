import {app, BrowserWindow, Menu } from 'electron'
import path from 'path'


app.on("ready", () => {
    const mainWindow = new BrowserWindow({
    })

    // Disable the default menu
    // Menu.setApplicationMenu(null);

    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react", "index.html"))
})
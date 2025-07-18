import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import screenConfigs from "../constants/screenConfig.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: screenConfigs.width, // Set the fixed width
    height: screenConfigs.height, // Set the fixed height
    resizable: false, // Prevent resizing
    fullscreenable: false, // Prevent fullscreen
    maximizable: false, // Prevent maximizing
    frame: true, // Keep the window frame (optional)
  });

  // Disable the default menu (removes the action bar)
  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(app.getAppPath(), "dist-react", "index.html"));
});

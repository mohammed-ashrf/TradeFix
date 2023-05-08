const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    backgroundColor:'#ffffff',
    icon: url.format({
      pathname: path.join(__dirname, `dist/repair-app-new/assets/icons/png/repairing.png`),
      protocol: "file:",
      slashes: true
    }),
    webPreferences: {
      nodeIntegration: true
    }, 
  });
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "dist/repair-app-new/index.html"),
      protocol: "file:",
      slashes: true
    })
  );
}
app.on("ready", createWindow);
// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on('activate', function() {
    // macOs specific close process
    if (win === null) {
        createWindow()
    }
})
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');
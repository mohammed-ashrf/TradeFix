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
  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "dist/repair-app-new/index.html"),
      protocol: "file:",
      slashes: true
    })
  );
  // // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()
  // win.on("closed", () => {
  //   win = null;
  // });
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
// app.commandLine.appendSwitch('no-sandbox');
  
// var current = document.getElementById('current'); 
// var options = {
//     silent: false,
//     printBackground: true,
//     color: false,
//     margin: {
//         marginType: 'printableArea'
//     },
//     landscape: false,
//     pagesPerSheet: 1,
//     collate: false,
//     copies: 1,
//     header: 'Header of the Page',
//     footer: 'Footer of the Page'
// }
  
// current.addEventListener('click', (event) => {
//     let win = BrowserWindow.getFocusedWindow();
//     // let win = BrowserWindow.getAllWindows()[0];
  
//     win.webContents.print(options, (success, failureReason) => {
//         if (!success) console.log(failureReason);
  
//         console.log('Print Initiated');
//     });
// });
/////////////////////////////////////////////////////////
// app.setUserTasks([
//   {
//     program: process.execPath,
//     arguments: '--new-window',
//     iconPath: process.execPath,
//     iconIndex: 0,
//     title: 'New Window',
//     description: 'Create a new window'
//   }
// ])

// win.setThumbarButtons([
//   {
//     tooltip: 'button1',
//     icon: path.join(__dirname, 'button1.png'),
//     click () { console.log('button1 clicked') }
//   }, {
//     tooltip: 'button2',
//     icon: path.join(__dirname, 'button2.png'),
//     flags: ['enabled', 'dismissonclick'],
//     click () { console.log('button2 clicked.') }
//   }
// ])
// // win.setOverlayIcon('path/to/overlay.png', 'Description for overlay')
// win.once('focus', () => win.flashFrame(false))
// win.flashFrame(true)
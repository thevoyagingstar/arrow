import { app, BrowserWindow, ipcMain, dialog } from `electron`
import { windowsMap, window } from './main'
import { format as formatUrl } from `url`
import { join } from `path`;

const isDevelopment = process.env.NODE_ENV !== `production`
var lastWindow

ipcMain.on(`toggle_fullscreen`, (event, id) => {
    windowsMap.get(id).isFullScreen() ?
        windowsMap.get(id).setFullScreen(false)
        : windowsMap.get(id).setFullScreen(true)
})

ipcMain.on(`reload`, (event, id) => {
    lastWindow = id
    windowsMap.get(id).reload()
})

ipcMain.on(`set_minimum_dimensions`, (event, width, height, id) => {
    windowsMap.get(id).setMinimumSize(parseInt(width), parseInt(height))
})

ipcMain.on(`set_vibrancy`, (event, effect, id) => {
    // console.log('set_vibrancy', effect)
    windowsMap.get(id).setVibrancy(effect)
})

ipcMain.on(`set_background_color`, (event, color, id) => {
    // console.log('set_background_color', color, id)
    windowsMap.get(id).setBackgroundColor(color)
})

ipcMain.on(`change_palette`, (event, palette) => {
    // console.log('change_palette', palette)
    windowsMap.forEach(function (value, key) {
        windowsMap.get(parseInt(key)).webContents.send('apply_palette', palette);
    })
})
ipcMain.on(`open_file_dialog`, (event, id, directory) => {
    event.reply(`openDirectory`, dialog.showOpenDialogSync(windowsMap.get(id), {
        properties: [`openDirectory`], defaultPath: directory
    }))
})

ipcMain.on(`minimize_window`, (event, id) => {
    windowsMap.get(id).minimize()
})

ipcMain.on(`max_unmax`, (event, id) => {
    windowsMap.get(id).isMaximized() ?
        windowsMap.get(id).unmaximize()
        : windowsMap.get(id).maximize()
})

ipcMain.on(`launchArrow`, (event) => {
    url = isDevelopment ? `http://localhost:9080` :
        formatUrl({
            pathname: join(__dirname, `index.html`),
            protocol: `file`,
            slashes: true
        })
    windowsMap.get(window.id).loadURL(url)
})





// var commandLineArgs = []
// process.argv.forEach(function (val, index) {
//     commandLineArgs.push(val)
// })

ipcMain.on(`get_user_path`, (event) => {
    // var commandLineArgs = []
    // if (!isDevelopment) {
    //     process.argv.forEach(function (val, index) {
    //         commandLineArgs.push(val)
    //     });
    // }
    event.reply(`user_path`, app.getPath(`exe`), app.getName(), app.getVersion(),
        lastWindow ? lastWindow : windowsMap.get(window.id).id, app.getPath(`appData`),
        isDevelopment ? [] : process.argv)

    lastWindow = null
})


ipcMain.on('showEmogi', () => {
    app.showEmojiPanel()
})

import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { existsSync, promises as fs } from 'fs'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

const defaultProjectDirectory = app.getPath('documents')

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // ファイル選択ダイアログ
  ipcMain.handle('openFile', async () => {
    return await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        {
          name: 'プロジェクトファイル',
          extensions: ['dsktm', 'json']
        }
      ]
    })
  })

  ipcMain.handle('readFile', async (_, paths: string) => {
    const result = {
      data: {},
      error: false,
      errorMsg: ''
    }
    try {
      const data = await fs.readFile(paths, 'utf8')
      result.data = JSON.parse(data)
    } catch (error) {
      result.error = true
      result.errorMsg = typeof error === 'string' ? error : String(error)
    }
    return result
  })

  ipcMain.on('isExist', (event, projectName) => {
    event.returnValue = existsSync(join(defaultProjectDirectory, projectName))
  })

  ipcMain.handle('initProject', async (_, values) => {
    const result = {
      path: '',
      error: false,
      errorMsg: ''
    }
    try {
      await fs.mkdir(join(defaultProjectDirectory, values.PROJECT_NAME), { recursive: true })
      await fs.writeFile(
        join(defaultProjectDirectory, values.PROJECT_NAME, 'project.json'),
        JSON.stringify(values)
      )
      result.path = join(defaultProjectDirectory, values.PROJECT_NAME, 'project.json')
    } catch (error) {
      result.error = true
      result.errorMsg = typeof error === 'string' ? error : String(error)
    }
    return result
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

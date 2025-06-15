import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { existsSync, promises as fsp, readFileSync } from 'fs'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

const defaultProjectDirectory = app.getPath('documents')

class LanguageManager {
  static data = {}
  static language = {}
  static init(): void {
    this.setLanguage()
  }
  static setLanguage(lng: string = ''): void {
    const langList = JSON.parse(
      readFileSync(join(process.resourcesPath, '/lang/lang.json'), 'utf8')
    )
    const fallbackLang = JSON.parse(
      readFileSync(
        join(process.resourcesPath, '/lang/', langList[langList['fallback']['key']]['FileName']),
        'utf8'
      )
    )
    if (lng === '') {
      lng = app.getLocale()
    }
    if (
      langList['fallback']['key'] !== lng &&
      Object.prototype.hasOwnProperty.call(langList, lng)
    ) {
      this.language = {
        [lng]: langList[lng]['localeName']
      }
      this.data = JSON.parse(
        readFileSync(join(process.resourcesPath, '/lang/', langList[lng]['FileName']), 'utf8')
      )
    }
    this.data = { ...fallbackLang, ...this.data }
    console.log(lng)
    console.log(this.data)
  }
}

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

  ipcMain.on('setTitle', (_, title) => {
    if (title !== undefined) {
      mainWindow.setTitle(`${app.getName()} - ${title}`)
    } else {
      mainWindow.setTitle(app.getName())
    }
  })

  // ファイル選択ダイアログ
  ipcMain.handle('openFile', async () => {
    return await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        {
          // @ts-ignore ファイルから読み込むデータに含まれています
          name: LanguageManager.data.PROJECT_FILE,
          extensions: ['dsktm', 'json']
        }
      ]
    })
  })

  // バージョン表示ダイアログ
  ipcMain.handle('openAbout', async (_, detail: string) => {
    return await dialog.showMessageBox(mainWindow, {
      message: `${app.getName()} ${app.getVersion()}`,
      detail: detail,
      icon: icon
    })
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
  LanguageManager.init()
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('readFile', async (_, paths: string) => {
    const result = {
      data: {},
      error: false,
      errorMsg: ''
    }
    try {
      const data = await fsp.readFile(paths, 'utf8')
      result.data = JSON.parse(data)
    } catch (error) {
      result.error = true
      result.errorMsg = typeof error === 'string' ? error : String(error)
    }
    return result
  })

  ipcMain.on('isExist', (event, projectName) => {
    event.returnValue = existsSync(join(defaultProjectDirectory, app.getName(), projectName))
  })

  ipcMain.on('getLanguage', (event) => {
    event.returnValue = LanguageManager.data
  })

  ipcMain.handle('initProject', async (_, values) => {
    const result = {
      path: '',
      error: false,
      errorMsg: ''
    }
    try {
      await fsp.mkdir(join(defaultProjectDirectory, app.getName(), values.PROJECT_NAME), {
        recursive: true
      })
      await fsp.writeFile(
        join(defaultProjectDirectory, app.getName(), values.PROJECT_NAME, 'project.json'),
        JSON.stringify(values)
      )
      result.path = join(
        defaultProjectDirectory,
        app.getName(),
        values.PROJECT_NAME,
        'project.json'
      )
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

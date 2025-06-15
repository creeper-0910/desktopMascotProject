export const lang = window.electron.ipcRenderer.sendSync('getLanguage')

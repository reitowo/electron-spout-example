import { app, BrowserWindow, screen } from 'electron';
import _ from 'lodash';
import { SpoutOutput } from '../spout/electron-spout.node';

var spout = new SpoutOutput('SpoutElectron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
  win.on('closed', () => {
    app.quit()
  })

  let factor = screen.getPrimaryDisplay().scaleFactor;
  const osr = new BrowserWindow({
    width: 1920 / factor,
    height: 1080 / factor,
    webPreferences: {
      offscreen: true,
      // @ts-ignore
      offscreenUseSharedTexture: true,
      zoomFactor: 1.0 / factor,
    },
    transparent: true,
    show: false,
    frame: false
  })

  osr.loadURL('https://www.bilibili.com/video/BV14V411k7sD')
  // @ts-ignore
  osr.webContents.on('paint', (e, dirty, image, tex) => {
    console.log(_.merge(dirty, tex))
    spout.updateTexture(tex);
  })
  osr.webContents.setFrameRate(60)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}) 
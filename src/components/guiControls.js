import * as dat from 'dat.gui'
import {
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  ACESFilmicToneMapping,
  LinearEncoding,
  sRGBEncoding,
  RGBEEncoding,
  RGBM7Encoding,
  RGBM16Encoding,
  RGBDEncoding,
  GammaEncoding,
  LogLuvEncoding,
  CineonToneMapping,
} from 'three'

const createGUIController = (e) => {
  const { camera, renderer, bloomPass } = e
  const gui = new dat.GUI()

  // Renderer controls
  gui
    .add(renderer, 'toneMapping', {
      No: NoToneMapping,
      Linear: LinearToneMapping,
      Cineon: CineonToneMapping,
      Reinhard: ReinhardToneMapping,
      ACESFilmic: ACESFilmicToneMapping,
    })
    .onFinishChange(() => {
      renderer.toneMapping = Number(renderer.toneMapping)
    })
    .name('toneMapping')
  gui
    .add(renderer, 'outputEncoding', {
      LinearEncoding,
      sRGBEncoding,
      RGBEEncoding,
      RGBM7Encoding,
      RGBM16Encoding,
      RGBDEncoding,
      GammaEncoding,
      LogLuvEncoding,
    })
    .onFinishChange(() => {
      renderer.outputEncoding = Number(renderer.outputEncoding)
    })
    .name('outputEncoding')

  // renderer control exposure
  gui.add(renderer, 'toneMappingExposure', 0, 2, 0.01).name('Exposure')

  //* Camera controls
  gui.add(camera.position, 'x', -50, 100, 0.01).name('Cam X').listen()
  gui.add(camera.position, 'y', -50, 100, 0.01).name('Cam Y').listen()
  gui.add(camera.position, 'z', -100, 100, 0.01).name('Cam Z').listen()

  gui.add(camera.rotation, 'x', -10, 10, 0.01).name('Cam ROT X').listen()
  gui.add(camera.rotation, 'y', -10, 10, 0.01).name('Cam ROT Y').listen()
  gui.add(camera.rotation, 'z', -10, 10, 0.01).name('Cam ROT Z').listen()

  // Bloom Pass
  // Bloom Pass
  gui.add(bloomPass, 'enabled').setValue(true).name('Bloom Pass')
  gui.add(bloomPass, 'strength').min(0).max(10).step(0.01).listen()
  gui.add(bloomPass, 'radius').min(0).max(10).step(0.01).listen()
  gui.add(bloomPass, 'threshold').min(0).max(10).step(0.01).listen()
}
export { createGUIController }

import { WebGLRenderer, sRGBEncoding } from 'three'

const createRenderer = (canvas) => {
  const renderer = new WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
    powerPreference: 'high-performance',
  })

  // Renderer config
  //  renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = PCFSoftShadowMap
  renderer.physicallyCorrectLights = true
  // renderer.toneMapping = ACESFilmicToneMapping
  renderer.outputEncoding = sRGBEncoding
  renderer.colorManagement = true
  renderer.gammaOutput = true
  renderer.gammaFactor = 2.2

  // renderer exposure
  //renderer.toneMappingExposure = 1.0

  return renderer
}

export { createRenderer }

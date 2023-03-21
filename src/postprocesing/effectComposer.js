/* eslint-disable max-len */
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

const startPostProcessing = (renderer, scene, camera) => {
  const effectComposer = new EffectComposer(renderer)
  effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  effectComposer.setSize(window.innerWidth, window.innerHeight)

  const renderPass = new RenderPass(scene, camera)
  effectComposer.addPass(renderPass)

  return effectComposer
}

export { startPostProcessing }

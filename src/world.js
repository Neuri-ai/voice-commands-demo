/* eslint-disable class-methods-use-this */
/* eslint-disable one-var */
/* eslint-disable no-unused-vars */

import { createScene } from '@/components/scene'
import { createRenderer } from '@/systems/renderer'
import { Resizer } from '@/systems/resizer'
import { Loop } from '@/systems/loop'
import { SceneLoader } from '@/systems/loaders/sceneLoader'
import { startPostProcessing } from '@/postprocesing/effectComposer'
import { isDevMode } from '@/debug'
import { createGUIController } from '@/components/guiControls'

import { useBloom } from '@/postprocesing/useBloom'
import { useFXAA } from '@/postprocesing/antialias'

let container, scene, renderer, loop, controls, camera

class World {
  constructor(cont) {
    container = cont
    scene = createScene()
    renderer = createRenderer(container)
  }

  async init() {
    // Load model and get camera
    const { modelo } = await SceneLoader(scene, renderer)

    modelo.traverse((child) => {
      if (child.isCamera) {
        camera = child
      }
    })
    camera.antialias = true;

    const effectComposer = startPostProcessing(renderer, scene, camera)
    const bloomPass = useBloom(effectComposer)
    const fxaaPass = useFXAA(effectComposer, renderer, container)
    const resizer = new Resizer(camera, renderer, effectComposer)

    // start animations
    loop = new Loop(camera, scene, renderer, effectComposer)
    loop.updatables.push(modelo)

    //! This function only runs on development environment
    if (isDevMode()) {
      createGUIController({
        camera,
        renderer,
        bloomPass,
      })
      const gui = document.querySelector('.dg')
      gui.style.zIndex = 100
    }

    scene.add(modelo)
  }

  start() {
    loop.start()
  }

  stop() {
    loop.stop()
  }
}

export { World }

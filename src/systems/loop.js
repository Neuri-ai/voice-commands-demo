/* eslint-disable one-var */
/* eslint-disable no-unused-vars */

import Stats from 'stats.js'
import { Clock } from 'three'
import { isDevMode } from '@/debug'

const clock = new Clock()
let fps, ms, memory

// Embed a stats chart for debugging purposes
const showStats = () => {
  fps = new Stats()
  fps.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(fps.dom)

  ms = new Stats()
  ms.showPanel(1)
  ms.domElement.style.cssText = 'position:absolute;top:50px;left:0px;'
  document.body.appendChild(ms.domElement)

  memory = new Stats()
  memory.showPanel(2)
  memory.domElement.style.cssText = 'position:absolute;top:98px;left:0px;'
  document.body.appendChild(memory.domElement)
}

// Start frame catch
const beginStats = () => {
  fps.begin()
  ms.begin()
  memory.begin()
}

// End frame catch
const endStats = () => {
  fps.end()
  ms.end()
  memory.end()
}

// This class is allow to rendering more that one frame
class Loop {
  constructor(camera, scene, renderer, effectComposer) {
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.updatables = []
    this.effect = effectComposer

    if (isDevMode()) showStats()
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      if (isDevMode()) beginStats()

      // tell every animated object to tick forward one frame
      this.tick()

      // render a frame
      this.effect.render()
      // this.renderer.render(this.scene, this.camera)

      if (isDevMode()) endStats()
    })
  }

  stop() {
    this.renderer.setAnimationLoop(null)
  }

  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta()

    this.updatables.map((object) => object.tick(delta))
  }
}

export { Loop }

/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */

const setSize = (camera, renderer, effectComposer) => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  effectComposer.setSize(window.innerWidth, window.innerHeight)
  // set pixel ratio  for retina display
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

class Resizer {
  constructor(camera, renderer, effectComposer) {
    // set initial size on load
    setSize(camera, renderer, effectComposer)

    window.addEventListener('resize', () => {
      // set the size again if a resize occurs
      setSize(camera, renderer, effectComposer)
    })
  }
}

export { Resizer }

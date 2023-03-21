import { Color, Scene } from 'three'

const createScene = () => {
  const scene = new Scene()

  scene.background = new Color('#05081B')

  return scene
}

export { createScene }

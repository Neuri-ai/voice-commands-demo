/* eslint-disable no-console */
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { globalLoader } from '@/systems/loaders/loadingManager'
import { setupModel } from '@/systems/setupModel'
import model from '@/models/room.glb'

const SceneLoader = async (escena, loopControl) => {
  const gLoader = globalLoader()
  const loader = new GLTFLoader(gLoader)

  const [scene] = await Promise.all([loader.loadAsync(model)])

  const modelo = setupModel(scene, escena, loopControl)

  return { modelo }
}
export { SceneLoader }

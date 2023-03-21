import {
  PlaneBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  RepeatWrapping,
  LinearFilter,
  LinearMipMapNearestFilter,
  sRGBEncoding,
} from 'three'
import { textureLoader } from '@/systems/loaders/textureLoader'
import montanas from '@/models/textures/fondo_montanoso.jpg'

const createMountains = () => {
  // get texture
  const textureManager = textureLoader()

  const map = textureManager.load(montanas)
  map.wrapS = RepeatWrapping
  map.wrapT = RepeatWrapping
  map.anisotropy = 16
  map.magFilter = LinearFilter
  map.minFilter = LinearMipMapNearestFilter
  map.encoding = sRGBEncoding

  const mountains = new Mesh(
    new PlaneBufferGeometry(200, 50, 2),
    new MeshBasicMaterial({ map })
  )
  // mountains.position.set(29.2, 17.23, -50) // y: 10.2
  mountains.position.set(5.3, 29.7, -50)

  return mountains
}

export { createMountains }

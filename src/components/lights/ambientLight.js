import { DirectionalLight, HemisphereLight } from 'three'

const createLights = () => {
  const ambientLight = new HemisphereLight(
    'white', // bright sky color
    '#9b7653', // dim ground color
    0.53 // intensity
  )
  const mainLight = new DirectionalLight('white', 3.88)
  mainLight.position.set(-50, -1.8, -20.7)
  mainLight.castShadow = true
  mainLight.shadow.mapSize.width = 512
  mainLight.shadow.mapSize.height = 512

  return { ambientLight, mainLight }
}
export { createLights }

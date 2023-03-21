import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const createControls = (camera, canvas) => {
  const controls = new OrbitControls(camera, canvas)
  return controls
}

export { createControls }

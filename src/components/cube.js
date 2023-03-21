import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from 'three'

const createCube = () => {
  const geometry = new BoxBufferGeometry(2, 2, 2)
  const material = new MeshBasicMaterial({ color: 'red' })
  const cube = new Mesh(geometry, material)

  // cube.rotation.set(-0.5, -0.1, 0.8)

  // const radiansPerSecond = MathUtils.degToRad(30)

  // this method will be called once per frame
  cube.tick = (delta) => {
    // increase the cube's rotation each frame
    cube.rotation.y += delta
  }

  return cube
}

export { createCube }

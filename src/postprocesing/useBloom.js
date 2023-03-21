/* eslint-disable max-len */
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

let bloomValues = {
  strength: 0.79,
  radius: 0.56,
  threshold: 1.17,
}

const useBloom = (effectComposer) => {
  const bloomPass = new UnrealBloomPass()
  effectComposer.addPass(bloomPass)

  bloomPass.strength = bloomValues.strength
  bloomPass.radius = bloomValues.radius
  bloomPass.threshold = bloomValues.threshold

  return bloomPass
}



export { useBloom }

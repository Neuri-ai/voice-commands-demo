
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

const useFXAA = (effectComposer, renderer, container) => {
    const fxaaPass = new ShaderPass(FXAAShader)
    const pixelRatio = renderer.getPixelRatio()
    fxaaPass.material.uniforms['resolution'].value.x = 1 / (container.clientWidth * pixelRatio)
    fxaaPass.material.uniforms['resolution'].value.y = 1 / (container.clientHeight * pixelRatio)
    effectComposer.addPass(fxaaPass)
    
    return fxaaPass
}

export { useFXAA }

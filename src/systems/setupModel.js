import {
  AnimationMixer,
  AnimationUtils,
  LoopOnce,
  Mesh,
  MeshStandardMaterial,
  DirectionalLight,
  MathUtils,
  Vector3,
  SpotLight,
  PointLight,
  Color,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  VideoTexture,
  LinearFilter,
  RGBFormat,
} from 'three'
import { isDevMode } from '@/debug'
import * as dat from 'dat.gui'

import video from '@/models/duck.mp4'
import radio from '@/models/radio_music.mp3'
import { bloomValues } from '@/postprocesing/useBloom'

let gui
let lights = []
let doorOpen = false
let blindOpen = false

const rightSide = ['Foco', 'Foco001', 'Foco005']
const leftSide = ['Foco002', 'Foco003', 'Foco004']

const setupModel = (data, scene) => {
  if (isDevMode()) {
    gui = new dat.GUI()
  }

  const model = data.scene
  const anims = data.animations
  const mixer = new AnimationMixer(model)

  const animations = {
    open_door: AnimationUtils.subclip(anims[2], 'DoorOpen', 0, 100).optimize(),
    close_door: AnimationUtils.subclip(anims[2], 'DoorClose', 100, 200).optimize(),
    open_blind_1: AnimationUtils.subclip(anims[0], 'OpenBlind1', 0, 200).optimize(),
    open_blind_2: AnimationUtils.subclip(anims[1], 'OpenBlind2', 0, 200).optimize(),
    close_blind_1: AnimationUtils.subclip(anims[0], 'CloseBlind1', 200, 10000).optimize(),
    close_blind_2: AnimationUtils.subclip(anims[1], 'CloseBlind2', 200, 10000).optimize(),
  }

  // fix depth bug
  model.traverse((child) => {
    child.frustumCulled = true

    if (child instanceof Mesh && child.material instanceof MeshStandardMaterial)
      child.material.depthWrite = true

    if (child instanceof SpotLight || child instanceof PointLight) {
      child.intensity = 1

      if (child.name === 'Foco' || child.name === 'Foco001' || child.name === 'Foco005')
        child.position.x = 9.06
      child.intensity = 2.5
      if (child.name === 'Foco002' || child.name === 'Foco003' || child.name === 'Foco004')
        child.position.x = -9.06
      child.intensity = 2.5

      if (child.name === 'Área002') {
        child.intensity = 1.11
        child.position.y = 5.97
      }

      // child light color rgb(255, 255, 255)
      child.color = new Color(255, 255, 255)

      lights.push(child)
    }
  })

  const ambientLight = new DirectionalLight('#fff', 0.08)
  ambientLight.color = new Color(255, 255, 255)
  scene.add(ambientLight)

  // find Cubo009 (TV) and copy size and position
  const tv = model.children.find((child) => child.name === 'Cubo009')

  let tvDisplay = new Mesh(
    new PlaneBufferGeometry(2, 2),
    new MeshStandardMaterial({
      // copy color from tv
      color: tv.material.color,
      emissive: tv.material.emissive,
      emissiveIntensity: tv.material.emissiveIntensity,
      roughness: tv.material.roughness,
      metalness: tv.material.metalness,
    })
  )

  // create a video in dom
  let videoElement = document.createElement('video')
  videoElement.src = video
  videoElement.loop = true

  // create a audio in dom
  let audioElement = document.createElement('audio')
  audioElement.src = radio
  audioElement.loop = true

  // create a video texture
  let videoTexture = new VideoTexture(videoElement)
  videoTexture.needsUpdate = true
  videoTexture.minFilter = LinearFilter
  videoTexture.magFilter = LinearFilter
  videoTexture.format = RGBFormat
  videoTexture.crossOrigin = 'anonymous'

  // set video texture to tvDisplay
  tvDisplay.scale.set(2.2, 1.071, 1.071)
  tvDisplay.position.copy(tv.position)
  tvDisplay.position.x = -8
  tvDisplay.rotation.y = Math.PI * 0.5

  window.addEventListener('onInit', (e) => {
    videoElement.volume = 0.1
    audioElement.volume = 0.1
  })

  window.addEventListener('onResult', (e) => {
    // reduce volume to 10% when listening

    let message = e.detail

    console.log(message)

    if (message.actions.action === 'on') {
      let side = message.entities.find((entity) => entity.name === 'direction')
      let tv_display = message.entities.find(
        (entity) => entity.name === 'object' && entity.value === 'TV'
      )
      let light = message.entities.find(
        (entity) =>
          (entity.name === 'object' && entity.value === 'lights') || entity.value === 'light'
      )
      let radio_player = message.entities.find(
        (entity) => entity.name === 'object' && entity.value === 'radio'
      )

      if (light) {
        if (side && side.value === 'right') {
          rightSide.forEach((light) => {
            lights.find((l) => l.name === light).intensity = 120
          })
          return
        }

        if (side && side.value === 'left') {
          leftSide.forEach((light) => {
            lights.find((l) => l.name === light).intensity = 120
          })
          return
        }

        lights.forEach((light) => {
          light.intensity = 2.5

          if (light.name === 'Área002') {
            light.intensity = 1.11
          }
        })
        ambientLight.intensity = 0.08
      }

      if (tv_display) {
        tvDisplay.material = new MeshBasicMaterial({
          map: videoTexture,
        })
        videoElement.play()
      }

      if (radio_player) {
        audioElement.play()
      }
    }

    if (message.actions.action === 'off') {
      let side = message.entities.find((entity) => entity.name === 'side')
      let tv_display = message.entities.find(
        (entity) => entity.name === 'object' && entity.value === 'TV'
      )
      let light = message.entities.find(
        (entity) =>
          (entity.name === 'object' && entity.value === 'lights') || entity.value === 'light'
      )
      let radio_player = message.entities.find(
        (entity) => entity.name === 'object' && entity.value === 'radio'
      )

      if (light) {
        if (side && side.value === 'right') {
          rightSide.forEach((light) => {
            lights.find((l) => l.name === light).intensity = 0
          })
          return
        }

        if (side && side.value === 'left') {
          leftSide.forEach((light) => {
            lights.find((l) => l.name === light).intensity = 0
          })
          return
        }

        lights.forEach((light) => {
          light.intensity = 0
        })
        ambientLight.intensity = 0
      }

      if (tv_display) {
        tvDisplay.material = new MeshStandardMaterial({
          color: tv.material.color,
          emissive: tv.material.emissive,
          emissiveIntensity: tv.material.emissiveIntensity,
          roughness: tv.material.roughness,
          metalness: tv.material.metalness,
        })
        videoElement.pause()
      }

      if (radio_player) {
        audioElement.pause()
      }
    }

    if (message.actions.action === 'open') {
      // if not "door" on entities [{name: object, value: "door"}] then open the door
      let door = message.entities.find(
        (entity) => entity.name === 'object' && entity.value === 'door'
      )
      let blind = message.entities.find(
        (entity) => entity.name === 'object' && entity.value === 'blind' || entity.value === 'blinds'
      )
      let object = []

      if (door) {
        object = [animations.open_door]
        doorOpen = true
      }

      if (blind) {
        object = [animations.open_blind_1, animations.open_blind_2]
        blindOpen = true
      }

      if (object) {
        object.map((clip) => {
          const player = mixer.clipAction(clip)
          player.clampWhenFinished = true
          player.loop = LoopOnce
          player.play()
        })
      }
    }


    if (message.actions.action === 'close') {
      // if not "door" on entities [{name: object, value: "door"}] then close the door
      let door = message.entities.find(
        (entity) => entity.name === 'object' && entity.value === 'door'
      )
      let blind = message.entities.find(
        (entity) => entity.name === 'object' && entity.value === 'blind' || entity.value === 'blinds'
      )
      let object = []

      if (door) {
        // animation only plays when door is open
        if (!doorOpen) return
        mixer.stopAllAction()
        object = [animations.close_door]
      }

      if (blind) {
        if (!blindOpen) return
        mixer.stopAllAction()
        object = [animations.close_blind_1, animations.close_blind_2]
      }

      if (object) {
        object.map((clip) => {
          const player = mixer.clipAction(clip)
          player.clampWhenFinished = true
          player.loop = LoopOnce
          player.play()
        })
      }
    }


    // volume to 100%
    videoElement.volume = 1
    audioElement.volume = 1
  })

  // add lights to controls
  if (isDevMode()) {
    lights.forEach((light) => {
      const folder = gui.addFolder(light.name)
      folder.add(light.position, 'x', -10, 10, 0.01).name('X').listen()
      folder.add(light.position, 'y', -10, 10, 0.01).name('Y').listen()
      folder.add(light.position, 'z', -10, 10, 0.01).name('Z').listen()
      folder.add(light, 'intensity', -5, 5, 0.01).name('Intensity').listen()
      // color
      folder.addColor(light, 'color').name('Color').listen()
    })

    // add tvDisplay to controls
    const folder = gui.addFolder('TV')
    folder.add(tvDisplay.position, 'x', -10, 0, 0.01).name('X').listen()
    folder.add(tvDisplay.position, 'y', -10, 10, 0.01).name('Y').listen()
    folder.add(tvDisplay.position, 'z', -10, 10, 0.01).name('Z').listen()

    folder.add(tvDisplay.rotation, 'x', 0, 10, 0.01).name('Rotation X').listen()
    folder.add(tvDisplay.rotation, 'y', 0, 10, 0.01).name('Rotation Y').listen()
    folder.add(tvDisplay.rotation, 'z', 0, 10, 0.01).name('Rotation Z').listen()

    const TVRotation = gui.addFolder('TV rotation')
    TVRotation.add(tvDisplay.rotation, 'x', 0, 10, 0.01).name('Rotation X').listen()
    TVRotation.add(tvDisplay.rotation, 'y', 0, 10, 0.01).name('Rotation Y').listen()
    TVRotation.add(tvDisplay.rotation, 'z', 0, 10, 0.01).name('Rotation Z').listen()

    const ambient = gui.addFolder('Ambient')
    ambient.add(ambientLight, 'intensity', 0, 5, 0.01).name('Intensity').listen()
    ambient.addColor(ambientLight, 'color').name('Color').listen()
  }
  scene.add(tvDisplay)
  model.tick = (delta) => {
    mixer.update(delta)
  }

  return model
}

export { setupModel }

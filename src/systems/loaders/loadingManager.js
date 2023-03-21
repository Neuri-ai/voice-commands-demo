/* eslint-disable no-console */
import { LoadingManager } from 'three'


const cover = document.querySelector('.cover')
const mic = document.querySelector('.mic__container')


const globalLoader = () => {
  const loadingManager = new LoadingManager(
    // Loaded
    () => {
      cover.classList.add('ended')
      setTimeout(() => {
        cover.style.display = 'none'
        mic.style.display = 'block'
      }, 1500)
    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) => {
      // Calculate the progress and update the loadingBarElement
      let progressRatio = itemsLoaded / itemsTotal
      progressRatio = parseInt(progressRatio * 100, 10)
    }
  )
  return loadingManager
}

export { globalLoader }

import { logError } from './log'
import type {
  DrawCanvasConfig,
  DrawGroupColumnsItem,
  DrawImageOptions,
} from '../types'

const getImageOptionsList = (
  options: DrawCanvasConfig | DrawGroupColumnsItem[]
) => {
  let imageOptionList: DrawImageOptions[] = []
  options.forEach((item) => {
    if (item.type === 'image') {
      imageOptionList.push(item as DrawImageOptions)
    } else if (item.type === 'group') {
      imageOptionList = imageOptionList.concat(
        ...getImageOptionsList(item.columns)
      )
    }
  })

  return imageOptionList
}

export const traverseOptionsAddImageElement = async (
  options: DrawCanvasConfig
) => {
  const imageOptionList = getImageOptionsList(options)
  const loadImages = imageOptionList.map((item) =>
    getImageElement(item.url, item)
  )
  const imageOptionListResult = await Promise.allSettled(loadImages)

  for (let i = 0; i < imageOptionListResult.length; i++) {
    const image = imageOptionListResult[i]
    if (image.status === 'fulfilled') {
      imageOptionList[i].image = image.value
    } else if (image.status === 'rejected') {
      logError(image.reason)
    }
  }
}

const errorImageCache = new Map()

export const getImageElement = async (
  imageUrl?: string,
  options: Omit<DrawImageOptions, 'type'> = {} as any
) => {
  const { retryCount = 3, errorImage } = options
  const image = new Image()

  image.style.position = 'fixed'
  image.style.top = '9999px'
  image.style.left = '9999px'
  image.className = 'edraw-image'

  const retry = async () => {
    let currentRetryCount = 0
    while (++currentRetryCount < retryCount) {
      try {
        return await getImageElement(imageUrl, { ...options, retryCount: 0 })
      } catch {
        continue
      }
    }

    if (errorImage instanceof HTMLImageElement) {
      return errorImage
    } else if (typeof errorImage === 'string') {
      const errorImageElement = await getImageElement(errorImage, options)
      errorImageCache.set(errorImage, errorImageElement)
      return errorImageElement
    }

    const error = new Error(
      `url: ${imageUrl}, getImage failed, Retry count ${retryCount}`
    )
    throw error
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => {
      resolve(image)
    }
    image.onerror = async () => {
      document.body.removeChild(image)
      await retry().then(resolve).catch(reject)
    }
    image.crossOrigin = 'anonymous'
    image.src = imageUrl as any
    document.body.appendChild(image)
  })
}

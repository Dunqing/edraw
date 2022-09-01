export function createCanvasElement() {
  const canvas = document.createElement('canvas')

  canvas.style.position = 'fixed'
  canvas.style.top = '9999px'
  canvas.style.left = '9999px'
  canvas.className = 'edraw-canvas'

  return canvas
}

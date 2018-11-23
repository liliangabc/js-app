const utils = {
  createStyleSheet(styleStr) {
    let styleEl = document.getElementById('gameStyleSheet')
    if (styleEl) return
    let newStyleEl = document.createElement('style')
    newStyleEl.type = 'text/css'
    newStyleEl.id = 'gameStyleSheet'
    newStyleEl.innerHTML = styleStr
    document.head.appendChild(newStyleEl)
  },

  createCanvas(mountEl) {
    mountEl = typeof mountEl === 'string' && mountEl ? document.querySelector(mountEl) : document.body
    const wrapper = document.createElement('div')
    const canvas = document.createElement('canvas')
    wrapper.className = 'game-wrapper'
    canvas.className = 'game-ui'
    wrapper.appendChild(canvas)
    mountEl.appendChild(wrapper)
    return { wrapper, canvas }
  },

  getPixRatio(context) {
    var backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio || 1
    return (window.devicePixelRatio || 1) / backingStore
  },

  isFunc(func) {
    return typeof func === 'function'
  },

  getRndInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  imageLoad(src) {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.onload = () => {
        image.onload = null
        resolve(image)
      }
      image.onerror = error => {
        image.onerror = null
        reject(new Error('图片加载失败'))
      }
      image.src = src
    })
  },

  roundRect(context, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2
    if (h < 2 * r) r = h / 2
    context.beginPath()
    context.moveTo(x + r, y)
    context.arcTo(x + w, y, x + w, y + h, r)
    context.arcTo(x  +w, y + h, x, y + h, r)
    context.arcTo(x, y + h, x, y, r)
    context.arcTo(x, y, x + w, y, r)
    context.closePath()
  }
}

export default utils
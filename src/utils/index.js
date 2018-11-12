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
    mountEl = mountEl || document.body
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
  }
}

export default utils
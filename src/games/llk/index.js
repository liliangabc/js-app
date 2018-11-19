/**
 * 经典连连看
 * author: liliang
 */

import utils from '../utils'

class Game {
  constructor(mountEl, callbacks = {}) {
    this.callbacks = callbacks
    let el = mountEl && typeof mountEl === 'string' ?
      document.querySelector(mountEl) : mountEl
    this.canvas = utils.createCanvas(el).canvas
    this.context = this.canvas.getContext('2d')
    this.pixRatio = utils.getPixRatio(this.context)
    this.canvas.addEventListener('click', this.onClick.bind(this))
  }

  initUI({ rows, cols }) {
    rows = rows || cols
    if (rows * cols % 2) throw new Error('行和列的积必须是2的倍数.')
    this.rows = rows
    this.cols = cols
    this.blockSpace = this.pixRatio * 3
    this.updateSize()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = width * this.pixRatio
    this.blockSize = (this.width - (this.cols + 1) * this.blockSpace) / this.cols
    this.height = this.canvas.height = (this.blockSize + this.blockSpace) * this.rows + this.blockSpace
  }

  onClick(event) {
    console.log('clicked.')
  }
}

export default Game
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

  initUI({ rows, cols, imgOptions = {} }) {
    rows = rows || cols
    if ((rows * cols) / (imgOptions.rows * imgOptions.cols)  % 2) {
      throw new Error('行和列的积除以雪碧图的行和列的积必须是2的倍数.')
    }
    this.rows = rows
    this.cols = cols
    this.imgOptions = imgOptions
    this.blockSpace = this.pixRatio * 3
    this.updateSize()
    utils.imageLoad(imgOptions.src).then(img => {
      this.img = img
      this.blocks = this.genBlocks()
      this.drawUI()
    })
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = width * this.pixRatio
    this.blockSize = parseInt((this.width - (this.cols + 1) * this.blockSpace) / this.cols)
    this.height = this.canvas.height = (this.blockSize + this.blockSpace) * this.rows + this.blockSpace
  }

  onClick(event) {
    let curBlock = this.getCurBlock(event)
    console.log(curBlock)
  }

  createSprites() {
    let sprites = [], rtnSprites = [], { img, imgOptions } = this
    let dw = img.width / imgOptions.cols
    for (let row = 0; row < imgOptions.rows; row++) {
      for (let col = 0; col < imgOptions.cols; col++) {
        sprites.push({ dx: dw * col, dy: dw * row, dw })
      }
    }
    let len = this.rows * this.cols / sprites.length
    for (let i = 0; i < len; i++) rtnSprites.push(...sprites)
    rtnSprites.sort(() => Math.random() - .5)
    return rtnSprites
  }

  genBlocks() {
    let blocks = [], sprites = this.createSprites(), count = 0
    let { rows, cols, blockSize, blockSpace } = this
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let { dx, dy, dw } = sprites[count]
        blocks.push({
          row, col, dx, dy, dw,
          x: (blockSize + blockSpace) * col + blockSpace,
          y: (blockSize + blockSpace) * row + blockSpace
        })
        count++
      }
    }
    return blocks
  }

  drawUI() {
    this.context.clearRect(0, 0, this.width, this.height)
    this.blocks.forEach(_ => {
      this.context.drawImage(this.img, _.dx, _.dy, _.dw, _.dw, _.x, _.y, this.blockSize, this.blockSize)
    })
  }

  getCurBlock(event) {
    let space = parseInt(this.blockSize + this.blockSpace)
    let style = window.getComputedStyle(this.canvas, null)
    let padX = parseInt(style.paddingLeft)
    let padY = parseInt(style.paddingTop)
    let ex = parseInt((event.offsetX || event.pageX) * this.pixRatio - padX)
    let ey = parseInt((event.offsetY || event.pageY) * this.pixRatio - padY)
    let curCol = Math.floor((ex - this.blockSpace) / space)
    let curRow = Math.floor((ey - this.blockSpace) / space)
    return this.blocks.find(_ => _.row === curRow && _.col === curCol)
  }
}

export default Game
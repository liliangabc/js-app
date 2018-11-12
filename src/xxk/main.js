/**
 * 消消看游戏
 * author: liliang
 */

import fs from 'fs'
import utils from '../utils'

utils.createStyleSheet(fs.readFileSync(__dirname + '/style.css', 'utf8'))

class Block {
  constructor({ row, col, color }) {
    this.row = row
    this.col = col
    this.color = color
  }

  draw({ context, size, space }) {
    context.save()
    context.fillStyle = this.color
    context.fillRect(this.col * size + space, this.row * size + space, size - space, size - space)
    context.restore()
  }
}

class Board {
  constructor(mountEl, callbacks = {}) {
    this.callbacks = callbacks
    let { wrapper, canvas } = utils.createCanvas(mountEl)
    this.wrapper = wrapper
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
    this.pixRatio = utils.getPixRatio(this.context)
    this.addListener()
  }

  initUI({ rows, cols, colors = [] }) {
    if (colors.length < 3) throw new Error('请至少提供3种颜色.')
    this.rows = rows || cols
    this.cols = cols
    if ((this.rows * this.cols) % 2) throw new Error('行和列的积必须是2的倍数.')
    this.colors = colors
    this.blockSize = 0
    this.blockSpace = this.pixRatio * 2
    this.removedColor = '#fff'
    this.updateSize()
    this.blocks = this.genBlocks()
    this.drawBlocks()
  }

  updateSize() {
    let cvsWidth, width = this.canvas.offsetWidth
    this.canvas.width = cvsWidth = this.pixRatio * width
    this.blockSize = (cvsWidth - this.blockSpace) / this.cols
    this.canvas.height = this.rows * this.blockSize + this.blockSpace
  }

  genBlocks() {
    let total = this.rows * this.cols
    let colorCount = this.colors.length
    let colors = [], blocks = [], index = 0
    for (let i = 0; i < total / 2; i++) {
      colors.push(this.colors[utils.getRndInt(0, colorCount - 1)])
    }
    colors = colors.concat(colors).sort(() => Math.random() - .5)
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        blocks.push(new Block({ row, col, color: colors[index] }))
        index++
      }
    }
    return blocks
  }

  drawBlocks() {
    let { width, height } = this.canvas
    let { context, blockSize: size, blockSpace: space } = this
    this.context.clearRect(0, 0, +width, +height)
    this.blocks.forEach(_ => _.draw({ context, size, space }))
  }

  getCurBlock(event) {
    let ex = (event.offsetX || event.pageX) * this.pixRatio
    let ey = (event.offsetY || event.pageY) * this.pixRatio
    let curCol = Math.floor(ex / this.blockSize)
    let curRow = Math.floor(ey / this.blockSize)
    for (let i = 0, len = this.blocks.length; i < len; i++) {
      let _ = this.blocks[i]
      if (_.row === curRow && _.col === curCol) return _
    }
  }

  getTRBLBlocks(block) {
    let i = this.blocks.indexOf(block)
    let T = this.blocks[i - this.rows]
    let R = this.blocks[i + 1]
    let B = this.blocks[i + this.rows]
    let L = this.blocks[i - 1]
    let blocks = [T, R, B, L]
    if (i % this.cols === 0) {
      blocks = [T, R, B]
    } else if ((i + 1) % this.cols === 0) {
      blocks = [T, B, L]
    }
    return blocks.filter(_ => _)
  }

  getIdentColorBlocks(block) {
    let checkedBlocks = [], noCheckBlocks = [block]
    while (noCheckBlocks.length) {
      let b = noCheckBlocks.pop()
      checkedBlocks.push(b)
      this.getTRBLBlocks(b).forEach(_ => {
        if (_.color === b.color && checkedBlocks.indexOf(_) === -1) {
          noCheckBlocks.push(_)
        }
      })
    }
    return checkedBlocks
  }

  drawScores(blocks) {
    let cvsStyle = window.getComputedStyle(this.canvas, null)
    let padX = parseInt(cvsStyle.paddingLeft)
    let padY = parseInt(cvsStyle.paddingTop)
    const div = document.createElement('div')
    div.innerHTML = blocks.map(_ => {
      let T = _.row * this.blockSize / this.pixRatio + padY + 'px'
      let L = _.col * this.blockSize / this.pixRatio + padX + 'px'
      let W = this.blockSize / this.pixRatio + 'px'
      return `<span class="scores" style="top:${T};left:${L};width:${W};height:${W};line-height:${W}">+${blocks.length}</span>`
    }).join('')
    this.wrapper.appendChild(div)
    setTimeout(() => this.wrapper.removeChild(div), 300)
  }

  addListener() {
    this.canvas.addEventListener('click', this.onClick.bind(this))
  }

  onClick(event) {
    let curBlock = this.getCurBlock(event)
    if (!curBlock || curBlock.color === this.removedColor) return
    let identColorBlocks = this.getIdentColorBlocks(curBlock)
    if (identColorBlocks.length < 2) return
    identColorBlocks.forEach(_ => _.color = this.removedColor)
    this.drawBlocks()
    this.drawScores(identColorBlocks)
  }
}

const demo = new Board()
demo.initUI({ cols: 10, colors: ['#22a6ea','#f44e4e','#b3cc25','#f1a30c','#b854e6'] })
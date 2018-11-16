/**
 * 数独游戏
 * author: liliang
 */

// import fs from 'fs'
import utils from '../utils'

// utils.createStyleSheet(fs.readFileSync(__dirname + '/style.css'))

class Block {
  constructor({ row, col, num = 0, isInput = false, isFocus = false }) {
    this.row = row
    this.col = col
    this.num = num
    this.isInput = isInput
    this.isFocus = isFocus
  }

  draw({ context, size, space }) {
    let x = (size + space) * this.col + space
    let y = (size + space) * this.row + space
    context.save()
    if (this.isInput) {
      context.fillStyle = '#fff'
      context.fillRect(x, y, size, size)
      if (this.isFocus) {
        context.save()
        context.strokeStyle = context.shadowColor = '#00f'
        context.shadowBlur = space * 8
        context.strokeRect(x, y, size, size)
        context.restore()
      }
    }
    if (this.num) {
      context.fillStyle = '#424242'
      context.font = `bold ${size / 2}px serif`
      context.textBaseline = 'hanging'
      let fw = context.measureText(this.num).width
      context.fillText(this.num, x + (size - fw) / 2, y + (size - fw) / 2)
    }
    context.restore()
  }
}

class Board {
  constructor(mountEl, callbacks = {}) {
    this.rows = this.cols = 9
    this.callbacks = callbacks
    this.canvas = utils.createCanvas(mountEl).canvas
    this.context = this.canvas.getContext('2d')
    this.pixRatio = utils.getPixRatio(this.context)
    this.blockSpace = this.pixRatio
    this.keyboard = this.createNumKeys()
    this.canvas.addEventListener('click', this.onClick.bind(this))
    this.keyboard.addEventListener('click', this.onKeyboardClick.bind(this))
  }

  onClick(event) {
    let curBlock = this.getCurBlock(event)
    if (curBlock === this.focusBlock) return
    this.focusBlock && (this.focusBlock.isFocus = false)
    if (curBlock && curBlock.isInput) {
      this.focusBlock = curBlock
      this.focusBlock.isFocus = true
    } else {
      this.focusBlock = null
    }
    this.drawUI()
    this.updateNumkeysPos()
  }

  onKeyboardClick(event) {
    let { target } = event, { onDone } = this.callbacks
    if (target.tagName.toLowerCase() === 'li') {
      this.focusBlock.num = +target.textContent
      this.focusBlock.isFocus = false
      this.focusBlock = null
    }
    this.drawUI()
    this.keyboard.classList.remove('show')
    if (this.checkDone()) {
      setTimeout(() => utils.isFunc(onDone) && onDone(), 300)
    }
  }

  getCurBlock(event) {
    let space = this.blockSize + this.blockSpace
    let ex = (event.offsetX || event.pageX) * this.pixRatio
    let ey = (event.offsetY || event.pageY) * this.pixRatio
    let curCol = Math.floor((ex - this.blockSpace) / space)
    let curRow = Math.floor((ey - this.blockSpace) / space)
    for (let i = 0, len = this.blocks.length; i < len; i++) {
      let _ = this.blocks[i]
      if (_.row === curRow && _.col === curCol) return _
    }
  }

  createNumKeys() {
    let ul = document.createElement('ul')
    ul.className = 'keyboard'
    ul.innerHTML = Array(9).fill(null).map((_, i) => `<li>${i + 1}</li>`).join('')
    this.canvas.parentNode.appendChild(ul)
    return ul
  }

  updateNumkeysPos() {
    let { blockSize, blockSpace, pixRatio, keyboard } = this
    if (this.focusBlock) {
      let { row } = this.focusBlock
      keyboard.style.top = ((row + 1) * (blockSize + blockSpace) + blockSpace) / pixRatio + 'px'
      keyboard.classList.add('show')
    } else {
      keyboard.classList.remove('show')
    }
  }

  checkDone() {
    return this.bakEmptyBlocks.every((_, i) =>  _.num === this.blocks[i].num)
  }

  initUI(emptyCount = 20, colors = ['#ccc','#def1e6']) {
    this.emptyCount = Math.min(emptyCount, 72)
    this.colors = colors
    this.focusBlock = null
    this.updateSize()
    this.keyboard.style.lineHeight = this.blockSize / this.pixRatio + 'px'
    let { bakEmptyBlocks, blocks } = this.genBlocks()
    this.bakEmptyBlocks = bakEmptyBlocks
    this.blocks = blocks
    this.drawUI()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = this.canvas.height = width * this.pixRatio
    this.blockSize = (this.width - (this.rows + 1) * this.blockSpace) / this.rows
  }

  initTable() {
    let table = [
      [8,7,1,9,3,2,6,4,5],
      [4,9,5,8,6,1,2,3,7],
      [6,3,2,7,5,4,8,1,9],
      [5,2,8,4,7,3,1,9,6],
      [9,1,3,6,2,5,7,8,4],
      [7,6,4,1,9,8,3,5,2],
      [2,8,7,3,4,9,5,6,1],
      [1,4,6,5,8,7,9,2,3],
      [3,5,9,2,1,6,4,7,8]
    ]
    for (let i = 0; i < 50; i++) this.replaceNum(table)
    return table
  }

  replaceNum(table) {
    let numA = utils.getRndInt(1, 9)
    let numB = utils.getRndInt(1, 9)
    if (numA === numB) return
    let numACoords = [], numBCoords = []
    table.forEach((sub, row) => {
      sub.forEach((_, col) => {
        if (_ === numA) {
          numACoords.push({ row, col })
        } else if (_ === numB) {
          numBCoords.push({ row, col })
        }
      })
    })
    numACoords.forEach(({ row, col }) => table[row][col] = numB)
    numBCoords.forEach(({ row, col }) => table[row][col] = numA)
  }

  genBlocks() {
    let blocks = [], table = this.initTable()
    table.forEach((sub, row) => {
      sub.forEach((num, col) => {
        blocks.push(new Block({ row, col, num }))
      })
    })
    blocks.sort(() => Math.random() - .5)
    let emptyBlocks = blocks.slice(0, this.emptyCount)
    let bakEmptyBlocks = JSON.parse(JSON.stringify(emptyBlocks))
    emptyBlocks.forEach(_ => {
      _.num = 0
      _.isInput = true
    })
    return { bakEmptyBlocks, blocks }
  }

  drawAreaBG() {
    let { context, colors } = this
    let width = this.width / 3, count = 0
    context.save()
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        context.fillStyle = colors[count % 2]
        context.fillRect(col * width, row * width, width, width)
        count++
      }
    }
    context.restore()
  }

  drawLines() {
    let { context, blockSize, blockSpace, rows, width } = this
    let space = blockSize + blockSpace
    context.save()
    context.lineWidth = blockSpace
    context.strokeStyle = '#424242'
    context.beginPath()
    for (let i = 0; i < rows + 1; i++) {
      context.moveTo(0, i * space + blockSpace / 2)
      context.lineTo(width, i * space + blockSpace / 2)
      context.moveTo(i * space + blockSpace / 2, 0)
      context.lineTo(i * space + blockSpace / 2, width)
    }
    context.stroke()
    context.restore()
  }

  drawUI() {
    let { context, width, blockSize: size, blockSpace: space } = this
    context.clearRect(0, 0, width, width)
    this.drawAreaBG()
    this.drawLines()
    this.blocks.forEach(_ => _.draw({ context, size, space  }))
  }
}

let demo = new Board(null, {
  onDone() {
    demo.initUI(demo.emptyCount + (confirm('恭喜！你完成了。要体验更高难度的吗？') ? 4 : 0))
  }
})
demo.initUI()
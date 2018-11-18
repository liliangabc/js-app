/**
 * 2018游戏
 * author: liliang
 */

import utils from '../utils'

const COLORS = {
  2: {
    color: '#333',
    bgcolor: '#eee4da'
  },
  4: {
    color: '#333',
    bgcolor: '#ece0ca'
  },
  8: {
    color: '#f7f7f5',
    bgcolor: '#f2b179'
  },
  16: {
    color: '#f7f7f5',
    bgcolor: '#f59563'
  },
  32: {
    color: '#f7f7f5',
    bgcolor: '#f57c5f'
  },
  64: {
    color: '#f7f7f5',
    bgcolor: '#ff5734'
  },
  128: {
    color: '#f7f7f5',
    bgcolor: '#f4cc6d'
  },
  256: {
    color: '#f7f7f5',
    bgcolor: '#d65211'
  },
  512: {
    color: '#f7f7f5',
    bgcolor: '#e29441'
  },
  1024: {
    color: '#f7f7f5',
    bgcolor: '#9e790a'
  },
  2048: {
    color: '#fefdf9',
    bgcolor: '#e0ba01'
  }
}

class Board {
  constructor(mountEl, callbacks = {}) {
    this.rows = this.cols = 4
    this.callbacks = callbacks
    this.canvas = utils.createCanvas(mountEl).canvas
    this.context = this.canvas.getContext('2d')
    this.pixRatio = utils.getPixRatio(this.context)
    this.blockSpace = this.pixRatio * 12
    this.addListener()
  }

  initUI() {
    this.isEnd = false
    this.score = 0
    this.updateSize()
    this.blocks = this.initBlocks()
    this.drawUI()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = this.canvas.height = width * this.pixRatio
    this.blockSize = (this.width - (this.rows + 1) * this.blockSpace) / this.rows
  }

  colToX(col) {
    return (this.blockSize + this.blockSpace) * col + this.blockSpace
  }

  rowToY(row) {
    return (this.blockSize + this.blockSpace) * row + this.blockSpace
  }

  getColData(col) {
    let x = this.colToX(col)
    return this.blocks.filter(_ => _.x === x)
  }

  getRowData(row) {
    let y = this.rowToY(row)
    return this.blocks.filter(_ => _.y === y)
  }

  drawBlock({ x, y, num }) {
    let { context, blockSize, pixRatio } = this
    utils.roundRect(context, x, y, blockSize, blockSize, 6 * pixRatio)
    context.fill()
    if (!num) return
    let fontSize = blockSize / ((num + '').length > 2 ? 3 : 2)
    context.save()
    context.fillStyle = COLORS[num].color
    context.font = `bold ${fontSize}px serif`
    context.textBaseline = 'hanging'
    let fw = context.measureText(num).width
    let tx = x + (blockSize - fw) / 2
    let ty = y + (blockSize - fontSize) / 2 + 6
    context.fillText(num, tx, ty)
    context.restore()
  }

  drawGrids() {
    let { rows, cols, context } = this
    context.save()
    context.fillStyle = '#eee4da'
    context.globalAlpha = .35
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        this.drawBlock({
          x: this.colToX(col),
          y: this.rowToY(row)
        })
      }
    }
    context.restore()
  }

  initBlocks() {
    let blocks = []
    let { rows, cols } = this
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        blocks.push({
          x: this.colToX(col),
          y: this.rowToY(row)
        })
      }
    }
    blocks.sort(() => Math.random() - .5)
    blocks.slice(0, 2).forEach(_ => _.num = 2)
    return blocks
  }

  rndBlock() {
    let blocks = this.blocks.filter(_ => !_.num)
    blocks.sort(() => Math.random() - .5)
    if (blocks.length) blocks[0].num = 2
  }

  drawBlocks() {
    this.blocks.forEach(_ => {
      if (_.num) {
        this.context.save()
        this.context.fillStyle = COLORS[_.num].bgcolor
        this.drawBlock(_)
        this.context.restore()
      }
    })
  }

  drawUI() {
    this.context.clearRect(0, 0, this.width, this.width)
    this.drawGrids()
    this.drawBlocks()
  }

  addListener() {
    document.addEventListener('keyup', this.onDocKeyup.bind(this))
    this.canvas.addEventListener('touchstart', this.onTouchstart.bind(this))
    this.canvas.addEventListener('touchmove', this.onTouchmove.bind(this))
    this.canvas.addEventListener('touchend', this.onTouchend.bind(this))
  }

  eachData(data) {
    let { onScoreUpdate } = this.callbacks
    let nums = data.map(_ => _.num).filter(_ => _), newNums = [...nums]
    for (let i = 0, len = newNums.length; i < len; i++) {
      let num = newNums[i], nextNum = newNums[i + 1]
      if (nextNum === num) {
        nums[i] = num * 2
        nums[i + 1] = 0
        this.score += num * 2
        utils.isFunc(onScoreUpdate) && onScoreUpdate(this.score)
        break
      }
    }
    nums = nums.filter(_ => _)
    data.forEach((_, i) => _.num = nums[i])
  }

  moveUp() {
    for (let col = 0; col < this.cols; col++) {
      let colData = this.getColData(col).sort((a, b) => a.y - b.y)
      this.eachData(colData)
    }
  }

  moveRight() {
    for (let row = 0; row < this.rows; row++) {
      let rowData = this.getRowData(row).sort((a, b) => b.x - a.x)
      this.eachData(rowData)
    }
  }

  moveDown() {
    for (let col = 0; col < this.cols; col++) {
      let colData = this.getColData(col).sort((a, b) => b.y - a.y)
      this.eachData(colData)
    }
  }

  moveLeft() {
    for (let row = 0; row < this.rows; row++) {
      let rowData = this.getRowData(row).sort((a, b) => a.x - b.x)
      this.eachData(rowData)
    }
  }

  onDocKeyup(event) {
    if (this.isEnd) return
    let { keyCode } = event
    let T = [87, 38], R = [68, 39], B = [83, 40], L = [65, 37]
    if (T.indexOf(keyCode) !== -1) {
      this.moveUp()
    } else if (R.indexOf(keyCode) !== -1) {
      this.moveRight()
    } else if (B.indexOf(keyCode) !== -1) {
      this.moveDown()
    } else if (L.indexOf(keyCode) !== -1) {
      this.moveLeft()
    }
    if ([...T, ...R, ...B, ...L].indexOf(keyCode) !== -1) {
      this.rndBlock()
      this.drawUI()
      this.checkDone()
    }
  }

  onTouchstart(event) {
    event.preventDefault()
    let touch=event.targetTouches[0]
    this.startX = touch.pageX
    this.startY = touch.pageY
  }

  onTouchmove(event) {
    event.preventDefault()
    let touch = event.targetTouches[0]
    this.endX = touch.pageX
    this.endY = touch.pageY
  }

  onTouchend() {
    if (!this.endX || this.isEnd) return
    let offX = Math.abs(this.endX - this.startX) / this.pixRatio
    let offY = Math.abs(this.endY - this.startY) / this.pixRatio
    if (offX > 6 || offY > 6) {
      if (offX > offY) {
        this[this.endX > this.startX ? 'moveRight' : 'moveLeft']()
      } else {
        this[this.endY > this.startY ? 'moveDown' : 'moveUp']()
      }
      this.rndBlock()
      this.drawUI()
      this.checkDone()
    }
    this.startX = this.startY = this.endX = this.endY = 0
  }

  checkDone() {
    let { onWinning, onGameover } = this.callbacks
    for (let i = 0, len = this.blocks.length; i < len; i++) {
      let _ = this.blocks[i]
      if (_.num === 2048) {
        setTimeout(() => utils.isFunc(onWinning) && onWinning(this.score), 100)
        this.isEnd = true
        return true
      }
      if (!_.num) return false
    }
    if (this.checkCells('rows') && this.checkCells('cols')) {
      setTimeout(() => utils.isFunc(onGameover) && onGameover(this.score), 100)
      return true
    }
  }

  checkCells(type = 'rows') {
    for (let i = 0; i < this[type]; i++) {
      let data = type === 'rows' ?
        this.getRowData(i).sort((a, b) => b.x - a.x) :
        this.getColData(i).sort((a, b) => b.y - a.y)
      let nums = data.map(_ => _.num)
      for (let j = 0; j < nums.length; j++) {
        let num = nums[j], nextNum = nums[j + 1]
        if (num === nextNum) return false
      }
    }
    return true
  }
}

let curScoreEl = document.getElementById('currentScore')
let bestScoreEl = document.getElementById('bestScore')
bestScoreEl.textContent = localStorage.getItem('score_for_2048') || 0

const getBestScore = score => {
  let locScore = localStorage.getItem('score_for_2048') || 0
  return Math.max(score, locScore)
}

const saveBestScore = score => {
  let bestScore = getBestScore(score)
  localStorage.setItem('score_for_2048', bestScore)
  return bestScore
}

const demo = new Board(document.getElementById('gameContainer'), {
  onWinning(score) {
    if (confirm(`恭喜，你挑战成功了！ 要继续挑战吗？`)) {
      bestScoreEl.textContent = saveBestScore(score)
      curScoreEl.textContent = 0
      demo.initUI()
    }
  },
  onGameover(score) {
    if (confirm(`不好意思，你挂了！ 要重新挑战吗？`)) {
      bestScoreEl.textContent = saveBestScore(score)
      curScoreEl.textContent = 0
      demo.initUI()
    }
  },
  onScoreUpdate(score) {
    curScoreEl.textContent = score
  }
})
demo.initUI()
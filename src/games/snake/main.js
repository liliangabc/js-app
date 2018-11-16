/**
 * 贪吃蛇游戏
 * author: liliang
 */

import fs from 'fs'
import utils from '../utils'

utils.createStyleSheet(fs.readFileSync(__dirname + '/style.css', 'utf8'))

class Block {
  constructor({ row, col, isSnake = false }) {
    this.row = row
    this.col = col
    this.isSnake = isSnake
  }

  draw({ context, size, space }) {
    let x = this.col * size + (this.col + 1) * space
    let y = this.row * size + (this.row + 1) * space
    context.save()
    context.fillStyle = this.isSnake ? '#000' : '#00f'
    context.fillRect(x, y, size, size)
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
    this.interval = 300
    this.addListener()
  }

  initUI({ rows, cols }) {
    this.rows = rows || cols
    this.cols = cols
    this.score = 0
    this.blockSize = 0
    this.lineWidth = 1
    this.width = 0
    this.height = 0
    this.speed = 1
    this.arrow = 1
    this.mainTid = null
    this.snake = this.initSnake()
    this.food = this.initFood()
    this.updateSize()
    this.drawObjects()
    this.timer()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.canvas.width = this.width = this.pixRatio * width
    this.blockSize = (this.width - (this.cols + 1) * this.lineWidth) / this.cols
    this.canvas.height = this.height = this.rows * (this.blockSize + this.lineWidth) + this.lineWidth
  }

  drawLines() {
    let { context, lineWidth, blockSize, rows, cols, width, height } = this
    let cellW = blockSize + lineWidth
    context.lineWidth = lineWidth
    context.strokeStyle = '#888'
    for (let i = 0; i <= rows; i++) {
      context.moveTo(0, i * cellW + lineWidth / 2)
      context.lineTo(width, i * cellW + lineWidth / 2)
    }
    for (let j = 0; j <= cols; j++) {
      context.moveTo(j * cellW + lineWidth / 2, 0)
      context.lineTo(j * cellW + lineWidth / 2, height)
    }
    context.stroke()
  }

  initSnake() {
    let isSnake = true
    let row = Math.floor(this.rows / 2) - 1
    let col = Math.floor(this.cols / 2)
    return [
      new Block({ row, col, isSnake }),
      new Block({ row: row + 1, col, isSnake }),
      new Block({ row: row + 2, col, isSnake })
    ]
  }

  initFood() {
    let blocks = []
    const isOK = (row, col) => this.snake.every(_ => _.row !== row || _.col !== col)
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (isOK(row, col)) blocks.push(new Block({ row, col }))
      }
    }
    return blocks[utils.getRndInt(0, blocks.length - 1)]
  }

  drawSnake() {
    let { context, blockSize: size, lineWidth: space } = this
    this.snake.forEach(_ => _.draw({ context, size, space }))
  }

  drawFood() {
    let { context, blockSize: size, lineWidth: space } = this
    this.food.draw({ context, size, space })
  }

  drawObjects() {
    this.context.clearRect(0, 0, this.width, this.height)
    this.drawLines()
    this.drawFood()
    this.drawSnake()
  }

  eatFood() {
    if (!this.canEat()) return
    let { onScoreUpdated } = this.callbacks
    let { row, col } = this.food
    this.snake.unshift(new Block({ row, col, isSnake: true }))
    this.food = this.initFood()
    this.drawObjects()
    this.score++
    utils.isFunc(onScoreUpdated) && onScoreUpdated(this.score)
    if (this.snake.length % 10 === 0) {
      this.speed += .2
      this.timer()
    }
  }

  canEat() {
    let { arrow, food } = this
    let { row, col } = this.snake[0]
    return (arrow === 1 && col === food.col && row === food.row + 1)
      || (arrow === 2 && col === food.col - 1 && row === food.row)
      || (arrow === 3 && col === food.col && row === food.row - 1)
      || (arrow === 4 && col === food.col + 1 && row === food.row)
  }

  timer() {
    let { onEnded } = this.callbacks
    clearInterval(this.mainTid)
    let duration = Math.floor(this.interval / this.speed)
    this.mainTid = setInterval(() => {
      if (this.isEnd()) {
        clearInterval(this.mainTid)
        utils.isFunc(onEnded) && onEnded(this.score)
      } else {
        this.moveSnake()
      }
      this.eatFood()
    }, duration)
  }

  moveSnake() {
    let action = ['moveUp', 'moveRight', 'moveDown', 'moveLeft'][this.arrow - 1]
    this[action]()
    this.drawObjects()
  }

  moveUp() {
    let { row, col } = this.snake[0]
    this.snake.unshift(new Block({
      row: row - 1, col, isSnake: true
    }))
    this.snake.pop()
  }

  moveRight() {
    let { row, col } = this.snake[0]
    this.snake.unshift(new Block({
      row, col: col + 1, isSnake: true
    }))
    this.snake.pop()
  }

  moveDown() {
    let { row, col } = this.snake[0]
    this.snake.unshift(new Block({
      row: row + 1, col, isSnake: true
    }))
    this.snake.pop()
  }

  moveLeft() {
    let { row, col } = this.snake[0]
    this.snake.unshift(new Block({
      row, col: col - 1, isSnake: true
    }))
    this.snake.pop()
  }

  isEnd() {
    let { arrow, rows, cols } = this, { row, col } = this.snake[0]
    return (arrow === 1 && row === 0)
      || (arrow === 2 && col === cols - 1)
      || (arrow === 3 && row === rows - 1)
      || (arrow === 4 && col === 0)
  }

  addListener() {
    this.canvas.addEventListener('click', this.onClick.bind(this))
  }

  onClick(event) {
    let ex = (event.offsetX || event.pageX) * this.pixRatio
    let ey = (event.offsetY || event.pageY) * this.pixRatio
    let { row, col } = this.snake[0]
    let { blockSize, lineWidth, arrow } = this
    let snakeX = col * blockSize + (col + 1) * lineWidth
    let snakeY = row * blockSize + (row + 1) * lineWidth
    if (arrow === 1 || arrow === 3) {
      if (ex > snakeX + blockSize) {
        this.arrow = 2
      } else if (ex < snakeX) {
        this.arrow = 4
      }
    } else if (arrow === 2 || arrow === 4) {
      if (ey > snakeY + blockSize) {
        this.arrow = 3
      } else if (ey < snakeY) {
        this.arrow = 1
      }
    }
    this.eatFood()
  }
}

let options = { cols: 20 }
const demo = new Board(null, {
  onEnded(score) {
    if (confirm(`不好意思，你挂了！ 你的得分：${score}; 要重新开始吗？`)) {
      demo.initUI(options)
    }
  },
  onScoreUpdated(score) {
    // console.log(`当前积分：${score}`)
  }
})
demo.initUI(options)
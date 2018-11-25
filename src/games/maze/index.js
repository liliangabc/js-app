/**
 * 走出迷宫
 * 采用深度优先算法实现迷宫生成
 * author: liliang
 */

import Color from 'color'
import utils from '../utils'

class Game {
  constructor(mountEl, callbacks = {}) {
    this.callbacks = callbacks
    const container = document.createElement('div')
    container.className = 'game-container'
    this.container = container
    this.canvas = utils.createCanvas(container).canvas
    this.gameCanvas = utils.createCanvas(container).canvas
    this.gameCanvas.parentNode.classList.add('upside')
    utils.getMountEl(mountEl).appendChild(container)
    this.context = this.canvas.getContext('2d')
    this.gameContext = this.gameCanvas.getContext('2d')
    this.pixRatio = utils.getPixRatio(this.context)
    this.moveSpeed = this.pixRatio * 2
    this.addListener()
  }

  createMobController() {
    const div = document.createElement('div')
    div.className = 'game-controller'
    div.innerHTML = `
      <a class="up"></a>
      <a class="right"></a>
      <a class="down"></a>
      <a class="left"></a>
    `
    div.addEventListener('touchstart', this.onCtrlTouchstart.bind(this), false)
    div.addEventListener('touchmove', this.onCtrlTouchmove.bind(this), false)
    div.addEventListener('touchend', this.onDocKeyup.bind(this), false)
    this.container.appendChild(div)
    return div
  }

  initUI({ rows, cols, wallW = 1, wallColor = '#fff' }) {
    rows = rows || cols
    this.rows = rows
    this.cols = cols
    this.wallW = wallW * this.pixRatio
    this.wallColor = wallColor
    this.onDocKeyup()
    this.updateSize()
    this.grid = this.initGrid()
    this.genMaze()
    this.startPos = this.getStartPos()
    this.ball = { ...this.startPos, r: this.cellW * .35 }
    this.endCoord = this.getEndCoord()
    this.drawUI()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = this.gameCanvas.width = width * this.pixRatio
    this.cellW = (this.width - this.wallW * (this.cols + 1)) / this.cols
    this.height = this.canvas.height = this.gameCanvas.height = (this.wallW + this.cellW) * this.rows + this.wallW
  }

  initGrid() {
    let arr = [], rows = this.rows * 2 - 1, cols = this.cols * 2 - 1
    for (let row = 0; row < rows; row++) {
      arr[row] = []
      for (let col = 0; col < cols; col++) {
        if (row % 2 || col % 2) {
          let coords = this.getWallXY(row, col)
          if (coords) {
            arr[row][col] = { row, col, num: 1, ...coords }
          } else {
            arr[row][col] = null
          }
        } else {
          arr[row][col] = { row, col, isCell: true, isFlag: false }
        }
      }
    }
    return arr
  }

  getWallXY(row, col) {
    let x1, y1, x2, y2, { wallW, cellW } = this, space = wallW + cellW, count = 0
    if (row % 2) { // 水平
      if (col % 2) return null
      x1 = col / 2 * space - wallW / 2
      y1 = y2 = (row + 1) / 2 * space
      x2 = x1 + space + wallW
    } else { // 垂直
      x1 = x2 = (col + 1) / 2 * space
      y1 = row / 2 * space - wallW / 2
      y2 = y1 + space + wallW
    }
    return { x1, y1, x2, y2 }
  }

  getCells() {
    let cells = []
    this.grid.forEach(sub => {
      sub.forEach(_ => _ && _.isCell && cells.push(_))
    })
    return cells
  }

  getWalls() {
    let walls = []
    this.grid.forEach(sub => {
      sub.forEach(_ => _ && !_.isCell && walls.push(_))
    })
    return walls
  }

  getRoundCell(cell, arrow) {
    let { row, col } = cell, { grid } = this
    switch (arrow) {
      case 'T':
        return grid[row - 2] && grid[row - 2][col]
      case 'R':
        return grid[row][col + 2]
      case 'B':
        return grid[row + 2] && grid[row + 2][col]
      case 'L':
        return grid[row][col - 2]
    }
  }

  removeWall(cell, arrow) {
    let { row, col } = cell, { grid } = this, curWall
    if (arrow === 'T') {
      curWall = grid[row - 1] && grid[row - 1][col]
    } else if (arrow === 'R') {
      curWall = grid[row][col + 1]
    } else if (arrow === 'B') {
      curWall = grid[row + 1] && grid[row + 1][col]
    } else if (arrow === 'L') {
      curWall = grid[row][col - 1]
    }
    if (curWall) curWall.num = 0
  }

  genMaze() {
    let curCell = this.getCells()[0], checkedCells = []
    const func = () => {
      let tCell = this.getRoundCell(curCell, 'T')
      let rCell = this.getRoundCell(curCell, 'R')
      let bCell = this.getRoundCell(curCell, 'B')
      let lCell = this.getRoundCell(curCell, 'L')
      let roundCells = [tCell, rCell, bCell, lCell].filter(_ => _ && checkedCells.indexOf(_) === -1)
      if (!roundCells.length) {
        curCell = null
        for (let i = checkedCells.length - 1; i >= 0; i--) {
          let _ = checkedCells[i]
          if (!_.isFlag) {
            curCell = _
            break
          }
        }
        if (!curCell) return true
        curCell.isFlag = true
        return
      }
      curCell = roundCells[utils.getRndInt(0, roundCells.length - 1)]
      this.removeWall(curCell, curCell === tCell ? 'B' : curCell === rCell ? 'L' : curCell === bCell ? 'T' : 'R')
      checkedCells[checkedCells.length] = curCell
    }
    while (!func()) { }
  }

  getStartPos() {
    let col = utils.getRndInt(0, this.grid[0].length - 1)
    col = col % 2 ? col - 1 : col
    let space = this.cellW + this.wallW
    let x = col * .5 * space + space * .5
    let y = this.wallW + this.cellW * .5
    return { x, y }
  }

  getEndCoord() {
    let row = this.grid.length - 1
    let col = utils.getRndInt(0, this.grid[row].length - 1)
    col = col % 2 ? col - 1 : col
    let space = this.cellW + this.wallW
    let x = col * .5 * space + this.wallW * .5
    let y = this.height - this.wallW
    return { row, col, x, y }
  }

  isImpact(pixData) {
    for (let i = 0, len = pixData.length; i < len; i += 4) {
      let color = new Color([pixData[i], pixData[i + 1], pixData[i + 2]]).toString()
      if (color === new Color(this.wallColor).toString()) return true
    }
  }

  isDone() {
    let { x: x1, y: y1 } = this.ball
    let { x, y } = this.endCoord
    let x2 = x + this.cellW * .5
    let y2 = y - this.cellW * .5
    return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) < Math.pow(this.cellW * .5, 2)
  }

  moveUp() {
    const getPixData = () => {
      let { x, y, r } = this.ball
      return this.context.getImageData(x - r, y - r - this.moveSpeed, r * 2, this.moveSpeed).data
    }
    if (this.isImpact(getPixData())) return
    this.ball.y -= this.moveSpeed
    if (this.isImpact(getPixData())) this.ball.y += this.pixRatio
  }

  moveRight() {
    const getPixData = () => {
      let { x, y, r } = this.ball
      return this.context.getImageData(x + r, y - r, this.moveSpeed, r * 2).data
    }
    if (this.isImpact(getPixData())) return
    this.ball.x += this.moveSpeed
    if (this.isImpact(getPixData())) this.ball.x -= this.pixRatio
  }

  moveDown() {
    const getPixData = () => {
      let { x, y, r } = this.ball
      return this.context.getImageData(x - r, y + r, r * 2, this.moveSpeed).data
    }
    if (this.isImpact(getPixData())) return
    this.ball.y += this.moveSpeed
    if (this.isImpact(getPixData())) this.ball.y -= this.pixRatio
  }

  moveLeft() {
    const getPixData = () => {
      let { x, y, r } = this.ball
      return this.context.getImageData(x - r - this.moveSpeed, y - r, this.moveSpeed, r * 2).data
    }
    if (this.isImpact(getPixData())) return
    this.ball.x -= this.moveSpeed
    if (this.isImpact(getPixData())) this.ball.x += this.pixRatio
  }

  move(arrow) {
    if (this.tid || this.aniFrame) return
    let { onDone = () => { } } = this.callbacks
    let action = ({ T: 'moveUp', R: 'moveRight', B: 'moveDown', L: 'moveLeft' })[arrow]
    let moveFunc = () => {
      this[action]()
      this.drawBall()
    }
    let animate = () => {
      if (this.isDone()) return onDone()
      moveFunc()
      this.aniFrame = requestAnimationFrame(animate)
    }
    moveFunc()
    this.tid = setTimeout(animate, 100)
  }

  onDocKeydown(event) {
    let { keyCode } = event
    let T = [87, 38], R = [68, 39], B = [83, 40], L = [65, 37]
    if (T.indexOf(keyCode) !== -1) {
      this.move('T')
    } else if (R.indexOf(keyCode) !== -1) {
      this.move('R')
    } else if (B.indexOf(keyCode) !== -1) {
      this.move('B')
    } else if (L.indexOf(keyCode) !== -1) {
      this.move('L')
    }
  }

  onDocKeyup() {
    clearTimeout(this.tid)
    cancelAnimationFrame(this.aniFrame)
    this.tid = this.aniFrame = null
  }

  onCtrlTouchstart(event) {
    event.preventDefault()
    let { className } = event.target
    let arrow = ({ up: 'T', right: 'R', down: 'B', left: 'L' })[className]
    this.move(arrow)
  }

  onCtrlTouchmove(event) {
    event.preventDefault()
    let target = event.target
    let touch = event.targetTouches[0]
    let ex = touch.pageX
    let ey = touch.pageY
    let offWidth = target.offsetWidth
    let offLeft = target.offsetLeft
    let offTop = target.offsetTop
    while (target.offsetParent) {
      offLeft += target.offsetParent.offsetLeft
      offTop += target.offsetParent.offsetTop
      target = target.offsetParent
    }
    if (ex < offLeft || ex > offLeft + offWidth || ey < offTop || ey > offTop + offWidth) this.onDocKeyup()
  }

  addListener() {
    document.addEventListener('keyup', this.onDocKeyup.bind(this), false)
    document.addEventListener('keydown', this.onDocKeydown.bind(this), false)
  }

  drawStartPos() {
    let { context, startPos, wallW, cellW } = this, { x, y } = startPos
    context.save()
    context.fillStyle = '#e33'
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x - cellW * .5, wallW)
    context.lineTo(x + cellW * .5, wallW)
    context.closePath()
    context.fill()
    context.restore()
  }

  drawBall() {
    let { gameContext: context, cellW } = this, { x, y, r } = this.ball
    context.clearRect(0, 0, this.width, this.height)
    context.save()
    context.fillStyle = '#ff0'
    context.beginPath()
    context.arc(x, y, r, 0, 2 * Math.PI)
    context.fill()
    context.restore()
  }

  drawEndCoord() {
    let { x, y } = this.endCoord, { context, cellW, wallW } = this
    context.clearRect(x, y - 1, cellW, wallW + 1)
    context.save()
    context.strokeStyle = '#0f0'
    context.beginPath()
    context.moveTo(x + cellW * .2, y - cellW * .4)
    context.lineTo(x + cellW * .5, y)
    context.lineTo(x + cellW * .8, y - cellW * .4)
    context.moveTo(x + cellW * .5, y)
    context.lineTo(x + cellW * .5, y - cellW * .8)
    context.stroke()
    context.restore()
  }

  drawUI() {
    let { context, wallW, wallColor, width, height } = this
    context.clearRect(0, 0, width, height)
    this.drawStartPos()
    context.save()
    context.strokeStyle = wallColor
    context.lineWidth = wallW
    context.strokeRect(wallW / 2, wallW / 2, width - wallW, height - wallW)
    this.getWalls().forEach(_ => {
      if (!_.num) return
      context.beginPath()
      context.moveTo(_.x1, _.y1)
      context.lineTo(_.x2, _.y2)
      context.stroke()
    })
    context.restore()
    this.drawEndCoord()
    this.drawBall()
  }
}

export default Game
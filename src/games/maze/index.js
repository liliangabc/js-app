/**
 * 走出迷宫
 * author: liliang
 */

import utils from '../utils'

class Game {
  constructor(mountEl, callbacks = {}) {
    this.callbacks = callbacks
    this.canvas = utils.createCanvas(mountEl).canvas
    this.context = this.canvas.getContext('2d')
    this.pixRatio = utils.getPixRatio(this.context)
  }

  initUI({ rows, cols, wallWidth = 10 }) {
    rows = rows || cols
    this.rows = rows
    this.cols = cols
    this.wallWidth = wallWidth * this.pixRatio
    this.updateSize()
    this.mazeTable = this.genMaze()
    this.drawUI()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = width * this.pixRatio
    this.wallSpace = (this.width - this.wallWidth * (this.cols + 1)) / this.cols
    this.height = this.canvas.height = (this.wallWidth + this.wallSpace) * this.rows + this.wallWidth
  }

  drawUI() {
    let { context, width, height, wallWidth } = this
    context.clearRect(0, 0, width, height)
    context.save()
    context.strokeStyle = '#fff'
    context.lineWidth = wallWidth
    context.beginPath()
    context.moveTo(width, wallWidth / 2)
    context.lineTo(wallWidth / 2, wallWidth / 2)
    context.lineTo(wallWidth / 2, height)
    context.stroke()
    this.mazeTable.forEach(sub => {
      sub.forEach(_ => {
        if (!_.num) return
        context.beginPath()
        context.moveTo(_.x1, _.y1)
        context.lineTo(_.x2, _.y2)
        context.stroke()
      })
    })
    context.restore()
  }

  initWalls() {
    let walls = [], rows = this.rows, cols = this.cols * 2
    let space = this.wallWidth + this.wallSpace
    for (let row = 0; row < rows; row++) {
      walls[row] = []
      for (let col = 0; col < cols; col++) {
        let x1, y1, x2, y2
        if (col % 2) {
          x1 = x2 = (col + 1) / 2 * space + this.wallWidth / 2
          y1 = space * row
          y2 = y1 + space + this.wallWidth
        } else {
          x1 = col / 2 * space
          y1 = y2 = space * (row + 1) + this.wallWidth / 2
          x2 = x1 + space + this.wallWidth
        }
        walls[row][col] = { row, col, num: 1, x1, y1, x2, y2 }
      }
    }
    return walls
  }

  getRoundWalls(wall, walls) {
    let arr = [], { row, col } = wall
    let rows = walls.length - 1, cols = walls[row].length - 1
    if (wall.col % 2) { // 垂直墙
      arr.push(walls[row][col - 2])
      walls[row - 1] && arr.push(...[walls[row - 1][col - 1], walls[row - 1][col + 1]])
      col + 2 < cols && arr.push(walls[row][col + 2])
      row < rows && arr.push(...[walls[row][col - 1], walls[row][col + 1]])
    } else { // 水平墙
      arr.push(walls[row][col - 1])
      walls[row - 1] && arr.push(walls[row - 1][col])
      if (walls[row + 1]) {
        arr.push(walls[row + 1][col - 1])
        row + 1 < rows && arr.push(walls[row + 1][col])
        col + 1 < cols && arr.push(walls[row + 1][col + 1])
      }
      col + 1 < cols && arr.push(walls[row][col + 1])
    }
    return arr.filter(_ => _)
  }

  genMaze() {
    let walls = this.initWalls()
    let rndRow = utils.getRndInt(0, walls.length - 2)
    let rndCol = utils.getRndInt(0, walls[rndRow].length - 2)
    let curWall = walls[rndRow][rndCol]
    curWall.num = 0
    let roundWalls = this.getRoundWalls(curWall, walls)
    return walls
  }
}

export default Game
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

  initUI({ rows, cols, wallW = 5, wallColor = '#fff' }) {
    rows = rows || cols
    this.rows = rows
    this.cols = cols
    this.wallW = wallW * this.pixRatio
    this.wallColor = wallColor
    this.updateSize()
    this.grid = this.initGrid()
    this.genMaze()
    this.drawUI()
    // this.findTable = this.createFindTable()
    // this.createMaze()
    // this.drawMaze()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = width * this.pixRatio
    this.cellW = (this.width - this.wallW * (this.cols + 1)) / this.cols
    this.height = this.canvas.height = (this.wallW + this.cellW) * this.rows + this.wallW
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
      x1 = col / 2 * space
      y1 = y2 = (row + 1) / 2 * space
      x2 = x1 + space + wallW / 2
    } else { // 垂直
      x1 = x2 = (col + 1) / 2 * space
      y1 = row / 2 * space
      y2 = y1 + space + wallW / 2
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

  getRoundCells(cell) {
    let cells = [], { row, col } = cell, { grid } = this
    grid[row - 2] && cells.push(grid[row - 2][col])
    grid[row + 2] && cells.push(grid[row + 2][col])
    cells.push(...[grid[row][col - 2], grid[row][col + 2]])
    return cells.filter(_ => _)
  }

  getRoundWalls(cell) {
    let walls = [], { row, col } = cell, { grid } = this
    grid[row - 1] && walls.push(grid[row - 1][col])
    grid[row + 1] && walls.push(grid[row + 1][col])
    walls.push(...[grid[row][col - 1], grid[row][col + 1]])
    return walls.filter(_ => _)
  }

  drawUI() {
    let { context, cellW, wallW, wallColor, width, height } = this
    context.clearRect(0, 0, width, height)
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
  }

  genMaze() {
    let cells = this.getCells(), checkedCells = []
    cells.sort(() => Math.random() - .5)
    let curCell = cells[utils.getRndInt(0, cells.length - 1)]
    while (cells.length) {
      let cell = cells.pop()
      let roundCells = this.getRoundCells(cell)
      let roundWalls = this.getRoundWalls(cell)
      if (roundWalls.length) {
        roundWalls[utils.getRndInt(0, roundWalls.length - 1)].num = 0
      }
    }
  }

  createMaze() {
    var that = this
    var sRow = Math.floor(Math.random() * this.findTable.length)
    var sCol = Math.floor(Math.random() * this.findTable[0].length)
    var p = this.findTable[sRow][sCol]
    var checked = []
    function findFunc() {
      var tp = that.getCell(p, 'top')
      var rp = that.getCell(p, 'right')
      var bp = that.getCell(p, 'bottom')
      var lp = that.getCell(p, 'left')
      var points = [tp, rp, bp, lp]
      points = points.filter(function (item) {
        return item && checked.indexOf(item) == -1
      })
      if (points.length == 0) {
        p = null
        for (var i = 0, len = checked.length; i < len; i++) {
          var item = checked[i]
          if (!item.tag) {
            p = item
            break
          }
        }
        if (!p) { return true }
        p.tag = true
        return false
      }
      var rndP = points[Math.floor(Math.random() * points.length)]
      if (rndP == tp) {
        that.removeWall(p, 'top')
      } else if (rndP == rp) {
        that.removeWall(p, 'right')
      } else if (rndP == bp) {
        that.removeWall(p, 'bottom')
      } else if (rndP == lp) {
        that.removeWall(p, 'left')
      }
      p = rndP
      checked.push(rndP)
    }
    while (!findFunc()) { }
  }
}

export default Game
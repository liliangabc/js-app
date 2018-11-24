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
    this.wallRGB = [255, 255, 255]
    this.endRGB = [50, 232, 107]
  }

  initUI({ rows, cols, wallW = 2 }) {
    rows = rows || cols
    this.rows = rows
    this.cols = cols
    this.wallW = wallW * this.pixRatio
    this.updateSize()
    this.map = this.initMap()
    this.findTable = this.createFindTable()
    this.createMaze()
    this.drawMaze()
    // this.drawUI()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = width * this.pixRatio
    this.cellW = (this.width - this.wallW * (this.cols + 1)) / this.cols
    this.height = this.canvas.height = (this.wallW + this.cellW) * this.rows + this.wallW
  }

  initMap() {
    let arr = [], rows = this.rows * 2 + 1, cols = this.cols * 2 + 1
    for (let row = 0; row < rows; row++) {
      arr[row] = []
      for (let col = 0; col < cols; col++) {
        arr[row][col] = +(row % 2 || col % 2)
      }
    }
    return arr
  }

  createFindTable() {
    let rows = this.rows * 2 + 1, cols = this.cols * 2 + 1
    let findTable = []
    for (let row = 1, y = 0; row < rows; row += 2, y++) {
      findTable[y] = []
      for (let col = 1, x = 0; col < cols; col += 2, x++) {
        findTable[y][x] = { row, col, x, y, tag: false }
      }
    }
    return findTable
  }

  removeWall(p, dir) {
    let o = null
    if (dir === 'top') {
      o = (p.row == 1) ? null : { row: p.row - 1, col: p.col }
    } else if (dir == 'right') {
      o = (p.col == this.cols * 2 - 1) ? null : { row: p.row, col: p.col + 1 }
    } else if (dir == 'bottom') {
      o = (p.row == this.rows * 2 - 1) ? null : { row: p.row + 1, col: p.col }
    } else if (dir == 'left') {
      o = (p.col == 1) ? null : { row: p.row, col: p.col - 1 }
    }
    this.map[o.row][o.col] = 0
  }
  getCell(p, dir) {
    if (dir == 'top') {
      return this.findTable[p.y - 1] ? this.findTable[p.y - 1][p.x] : undefined
    } else if (dir == 'right') {
      return this.findTable[p.y][p.x + 1]
    } else if (dir == 'bottom') {
      return this.findTable[p.y + 1] ? this.findTable[p.y + 1][p.x] : undefined
    } else if (dir == 'left') {
      return this.findTable[p.y][p.x - 1]
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

  drawMaze() {
    var x, y
    this.context.lineWidth = this.wallW
    this.context.strokeStyle = 'rgb(' + this.wallRGB[0] + ',' + this.wallRGB[1] + ',' + this.wallRGB[2] + ')'
    this.context.beginPath()
    this.context.moveTo(this.width, this.wallW / 2)
    this.context.lineTo(this.wallW / 2, this.wallW / 2)
    this.context.lineTo(this.wallW / 2, this.height)
    this.context.stroke()
    for (var i = 1, len = this.map.length; i < len; i += 2) {
      for (var j = 1, len2 = this.map[i].length; j < len2; j += 2) {
        // 绘制列
        if (this.map[i][j + 1]) {
          x = this.wallW * Math.ceil(j / 2) + this.cellW * Math.ceil(j / 2) + this.wallW / 2
          y = this.wallW * Math.ceil(i / 2) + this.cellW * Math.floor(i / 2) - this.wallW
          this.context.moveTo(x, y)
          this.context.lineTo(x, y + this.cellW + this.wallW * 2)
        }
        // 绘制行
        if (this.map[i + 1] && this.map[i + 1][j]) {
          x = this.wallW * Math.ceil(j / 2) + this.cellW * Math.floor(j / 2) - this.wallW
          y = this.wallW * Math.ceil(i / 2) + this.cellW * Math.ceil(i / 2) + this.wallW / 2
          this.context.moveTo(x, y)
          this.context.lineTo(x + this.cellW + this.wallW * 2, y)
        }
      }
    }
    this.context.moveTo(this.wallW / 2, 0)
    this.context.lineTo(this.wallW / 2, this.h)
    this.context.moveTo(0, this.wallW / 2)
    this.context.lineTo(this.w, this.wallW / 2)
    this.context.stroke()
    // 绘制开始位置
    this.context.beginPath()
    this.context.moveTo(this.startX, this.startY)
    this.context.lineTo(this.startX + this.cellW, this.startY)
    this.context.lineTo(this.startX + this.cellW / 2, this.startY + this.cellW / 3)
    this.context.closePath()
    this.context.fillStyle = '#444'
    this.context.fill()
    // 绘制出口位置
    this.context.beginPath()
    this.context.moveTo(this.endX + this.cellW / 4, this.endY + this.cellW * 2 / 3)
    this.context.lineTo(this.endX + this.cellW / 2, this.endY + this.cellW)
    this.context.lineTo(this.endX + this.cellW - this.cellW / 4, this.endY + this.cellW * 2 / 3)
    this.context.moveTo(this.endX + this.cellW / 2, this.endY + this.cellW)
    this.context.lineTo(this.endX + this.cellW / 2, this.endY + this.cellW / 4)
    this.context.strokeStyle = 'rgb(' + this.endRGB[0] + ',' + this.endRGB[1] + ',' + this.endRGB[2] + ')'
    this.context.stroke()
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
}

export default Game
/**
 * 人机大战五子棋
 * author: liliang
 */

import utils from '../utils'

class Game {
  constructor(mountEl, callbacks = {}) {
    this.callbacks = callbacks
    this.canvas = utils.createCanvas(mountEl).canvas
    this.context = this.canvas.getContext('2d')
    this.pixRatio = utils.getPixRatio(this.context)
    this.rows = this.cols = 15
    this.updateSize()
    this.canvas.addEventListener('click', this.onClick.bind(this))
  }

  initUI() {
    this.drawGrid()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = this.canvas.height = width * this.pixRatio
    this.lineWidth = this.pixRatio
    this.cellWidth = (this.width - (this.lineWidth * this.cols)) / this.cols
    this.chessRadius = (this.cellWidth + this.lineWidth) * .4
  }

  onClick(event) {

  }

  drawGrid() {
    const { context, lineWidth, rows, cols, cellWidth, width, chessRadius } = this
    context.save()
    context.lineWidth = lineWidth
    context.strokeStyle = '#333'
    context.translate((cellWidth + lineWidth) / 2, (cellWidth + lineWidth) / 2)
    for (let i = 0; i < rows; i++) {
      let b = (cellWidth + lineWidth) * i
      context.moveTo(-lineWidth / 2, b)
      context.lineTo(width - cellWidth - lineWidth / 2, b)
      context.moveTo(b, -lineWidth / 2)
      context.lineTo(b, width - cellWidth - lineWidth / 2)
    }
    context.stroke()
    let arr = [
      { row: 3, col: 3 },
      { row: 3, col: cols - 4 },
      { row: rows - 4, col: 3 },
      { row: rows - 4, col: cols - 4 }
    ]
    context.fillStyle = '#000'
    let space = cellWidth + lineWidth
    arr.forEach(_ => {
      context.beginPath()
      context.arc(space * _.col, space * _.row, chessRadius * .24, 0, Math.PI * 2)
      context.closePath()
      context.fill()
    })
    context.restore()
  }
}

export default Game
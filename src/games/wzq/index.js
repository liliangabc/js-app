/**
 * 人机大战五子棋
 * author: liliang
 */

import utils from '../utils'
import AIPlayer from './AIPlayer'

class Game {
  constructor(mountEl, callbacks = {}) {
    this.callbacks = callbacks
    this.canvas = utils.createCanvas(mountEl).canvas
    this.context = this.canvas.getContext('2d')
    this.pixRatio = utils.getPixRatio(this.context)
    this.rows = this.cols = 15
    this.updateSize()
    this.aiplayer = new AIPlayer(this)
    this.canvas.addEventListener('click', this.onClick.bind(this))
  }

  initUI() {
    this.chessData = this.genInitData()
    this.drawUI()
  }

  updateSize() {
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = this.canvas.height = width * this.pixRatio
    this.lineWidth = this.pixRatio
    this.cellWidth = (this.width - (this.lineWidth * this.cols)) / this.cols
    this.chessRadius = this.cellWidth * .4
  }

  onClick(event) {
    let { onGameover = () => {} } = this.callbacks
    let curChess = this.getCurrent(event)
    if (!curChess) return
    curChess.num = 2
    this.drawUI()
    if (this.checkResult(curChess)) return setTimeout(onGameover, 100, curChess.num)
    let aiCurChess = this.aiplayer.play()
    aiCurChess.num = 1
    this.drawUI()
    this.drawActiveAIChess(aiCurChess)
    if (this.checkResult(aiCurChess)) setTimeout(onGameover, 100, aiCurChess.num)
  }

  checkResult(chess) {
    return this.checkTB(chess) || this.checkLR(chess) || this.checkZXie(chess) || this.checkFXie(chess)
  }

  checkTB(chess) {
    let count = 0
    let arr = this.chessData.filter(_ => _.col === chess.col)
    let checks = arr.filter(_ => _.row < chess.row)
    for (let i = checks.length - 1; i >= 0; i--) {
      if (checks[i].num !== chess.num) break
      count++
    }
    checks = arr.filter(_ => _.row > chess.row)
    for (let i = 0; i < checks.length; i++) {
      if (checks[i].num !== chess.num) break
      count++
    }
    return count >= 4 ? chess.num : 0
  }

  checkLR(chess) {
    let count = 0
    let arr = this.chessData.filter(_ => _.row === chess.row)
    let checks = arr.filter(_ => _.col < chess.col)
    for (let i = checks.length - 1; i >= 0; i--) {
      if (checks[i].num !== chess.num) break
      count++
    }
    checks = arr.filter(_ => _.col > chess.col)
    for (let i = 0; i < checks.length; i++) {
      if (checks[i].num !== chess.num) break
      count++
    }
    return count >= 4 ? chess.num : 0
  }

  checkZXie(chess) {
    let count = 0
    for (let i = 1; i < 5; i++) {
      let item = this.chessData.find(_ => _.row === chess.row - i && _.col === chess.col + i)
      if (!item || item.num !== chess.num) break
      count++
    }
    for (let i = 1; i < 5; i++) {
      let item = this.chessData.find(_ => _.row === chess.row + i && _.col === chess.col - i)
      if (!item || item.num !== chess.num) break
      count++
    }
    return count >= 4 ? chess.num : 0
  }

  checkFXie(chess) {
    let count = 0
    for (let i = 1; i < 5; i++) {
      let item = this.chessData.find(_ => _.row === chess.row - i && _.col === chess.col - i)
      if (!item || item.num !== chess.num) break
      count++
    }
    for (let i = 1; i < 5; i++) {
      let item = this.chessData.find(_ => _.row === chess.row + i && _.col === chess.col + i)
      if (!item || item.num !== chess.num) break
      count++
    }
    return count >= 4 ? chess.num : 0
  }

  drawGrid() {
    let { context, lineWidth, rows, cols, cellWidth, width, chessRadius } = this
    let space = cellWidth + lineWidth
    context.save()
    context.lineWidth = lineWidth
    context.strokeStyle = '#333'
    context.translate(space / 2, space / 2)
    context.beginPath()
    for (let i = 0; i < rows; i++) {
      context.moveTo(-lineWidth / 2, space * i)
      context.lineTo(width - cellWidth - lineWidth / 2, space * i)
      context.moveTo(space * i, -lineWidth / 2)
      context.lineTo(space * i, width - cellWidth - lineWidth / 2)
    }
    context.stroke()
    let arr = [{ row: 3, col: 3 }, { row: 3, col: cols - 4 }, { row: rows - 4, col: 3 }, { row: rows - 4, col: cols - 4 }]
    context.fillStyle = '#000'
    arr.forEach(_ => {
      context.beginPath()
      context.arc(space * _.col, space * _.row, chessRadius * .24, 0, Math.PI * 2)
      context.fill()
    })
    context.restore()
  }

  drawUI() {
    let { context, width, chessRadius, chessData } = this
    context.clearRect(0, 0, width, width)
    this.drawGrid()
    context.save()
    chessData.forEach(_ => {
      if (!_.num) return
      context.fillStyle = _.num === 1 ? '#fff' : '#000'
      context.beginPath()
      context.arc(_.x, _.y, chessRadius, 0, Math.PI * 2)
      context.fill()
    })
    context.restore()
  }

  drawActiveAIChess(chess) {
    let { x, y } = chess, { chessRadius: r, context } = this
    context.save()
    context.fillStyle = '#ccc'
    context.beginPath()
    context.arc(x, y, r * .7, 0, Math.PI * 2)
    context.fill()
    context.restore()
  }

  genInitData() {
    let chessData = []
    let space = this.cellWidth + this.lineWidth
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let x = (col + .5) * space
        let y = (row + .5) * space
        chessData.push({ row, col, x, y, num: 0 })
      }
    }
    return chessData
  }

  getCurrent(event) {
    let { pow: p } = Math
    let ex = (event.offsetX || event.pageX) * this.pixRatio
    let ey = (event.offsetY || event.pageY) * this.pixRatio
    return this.chessData.find(_ => !_.num && p(ex - _.x, 2) + p(ey - _.y, 2) < p(this.chessRadius, 2))
  }
}

export default Game
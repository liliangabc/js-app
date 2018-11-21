/**
 * 经典连连看
 * author: liliang
 */

import utils from '../utils'

class Game {
  constructor(mountEl, callbacks = {}) {
    this.callbacks = callbacks
    let el = mountEl && typeof mountEl === 'string' ?
      document.querySelector(mountEl) : mountEl
    this.canvas = utils.createCanvas(el).canvas
    this.context = this.canvas.getContext('2d')
    this.pixRatio = utils.getPixRatio(this.context)
    this.canvas.addEventListener('click', this.onClick.bind(this))
  }

  initUI({ rows, cols, imgOptions = {} }) {
    rows = rows || cols
    if ((rows * cols) / (imgOptions.rows * imgOptions.cols)  % 2) {
      throw new Error('行和列的积除以雪碧图的行和列的积必须是2的倍数.')
    }
    this.rows = rows + 2
    this.cols = cols + 2
    this.imgOptions = imgOptions
    this.blockSpace = this.pixRatio * 3
    this.selBlock = null
    this.joinPoints = []
    this.updateSize()
    utils.imageLoad(imgOptions.src).then(img => {
      this.img = img
      this.blocks = this.genBlocks()
      this.drawUI()
    })
  }

  updateSize() {
    let { pixRatio, rows, cols, blockSpace } = this
    let width = this.canvas.offsetWidth
    this.width = this.canvas.width = width * pixRatio
    this.blockSize = (this.width - (cols - 1) * blockSpace) / (cols - 1)
    this.height = this.canvas.height = (this.blockSize + blockSpace) * (rows - 1)
  }

  onClick(event) {
    let curBlock = this.getCurBlock(event)
    if (!curBlock || this.selBlock === curBlock) return
    if (this.selBlock && this.isSameBlock(this.selBlock, curBlock)) {
      let blocks = this.findWay(this.selBlock, curBlock)
      if (blocks) {
        this.drawArc(curBlock)
        this.drawJoinLines([...blocks, curBlock])
        this.selBlock.num = curBlock.num = 0
        this.selBlock = null
        return setTimeout(() => {
          this.drawUI()
          this.doneCheck()
        }, 300)
      }
    }
    this.selBlock = curBlock
    this.drawUI()
  }

  isSameBlock(b1, b2) {
    return b1.dx === b2.dx && b1.dy === b2.dy
  }

  getCenter(block) {
    return [block.x + block.w / 2, block.y + block.h / 2]
  }

  findWay(b1, b2) {
    return this.lineDirect(b1, b2) || this.oneCorner(b1, b2) || this.twoCorner(b1, b2)
  }

  lineDirect(b1, b2) {
    let arr = []
    if (b1.row !== b2.row && b1.col !== b2.col) return false
    if (b1.col === b2.col) {
      arr = this.blocks.filter(_ => _ && _.col === b1.col)
      arr = b1.row > b2.row ?
        arr.filter(_ => _.row < b1.row && _.row > b2.row) :
        arr.filter(_ => _.row > b1.row && _.row < b2.row)
    } else if (b1.row === b2.row) {
      arr = this.blocks.filter(_ => _ && _.row === b1.row)
      arr = b1.col > b2.col ?
        arr.filter(_ => _.col < b1.col && _.col > b2.col) :
        arr.filter(_ => _.col > b1.col && _.col < b2.col)
    }
    return arr.every(_ => !_.num) ? [] : false
  }

  oneCorner(b1, b2) {
    let c = this.blocks.find(_ => _ && _.row === b1.row && _.col === b2.col)
    if (!c.num && this.lineDirect(b1, c) && this.lineDirect(c, b2)) return [c]
    c = this.blocks.find(_ => _ && _.row === b2.row && _.col === b1.col)
    if (!c.num && this.lineDirect(b1, c) && this.lineDirect(c, b2)) return [c]
    return false
  }

  twoCorner(b1, b2) {
    let sameRows = this.blocks.filter(_ => _ && _ !== b1 && _.row === b1.row)
    let sameCols = this.blocks.filter(_ => _ && _ !== b1 && _.col === b1.col)
    let upBlocks = sameCols.filter(_ => _.row < b1.row)
    let rightBlocks = sameRows.filter(_ => _.col > b1.col)
    let downBlocks = sameCols.filter(_ => _.row > b1.row)
    let leftBlocks = sameRows.filter(_ => _.col < b1.col)
    for (let i = upBlocks.length - 1; i >= 0; i--) {
      let _ = upBlocks[i]
      if (_.num) break
      let arr = this.oneCorner(_, b2)
      if (arr) return [_, ...arr]
    }
    for (let i = 0; i < rightBlocks.length; i++) {
      let _ = rightBlocks[i]
      if (_.num) break
      let arr = this.oneCorner(_, b2)
      if (arr) return [_, ...arr]
    }
    for (let i = 0; i < downBlocks.length; i++) {
      let _ = downBlocks[i]
      if (_.num) break
      let arr = this.oneCorner(_, b2)
      if (arr) return [_, ...arr]
    }
    for (let i = leftBlocks.length - 1; i >= 0; i--) {
      let _ = leftBlocks[i]
      if (_.num) break
      let arr = this.oneCorner(_, b2)
      if (arr) return [_, ...arr]
    }
  }

  doneCheck() {
    let { onDone = () => {} } = this.callbacks
    return this.blocks.every(_ => !(_ && _.num)) && setTimeout(onDone, 100)
  }

  createSprites() {
    let sprites = [], rtnSprites = [], { img, imgOptions } = this
    let dw = img.width / imgOptions.cols
    for (let row = 0; row < imgOptions.rows; row++) {
      for (let col = 0; col < imgOptions.cols; col++) {
        sprites.push({ dx: dw * col, dy: dw * row, dw })
      }
    }
    let len = (this.rows - 2) * (this.cols - 2) / sprites.length
    for (let i = 0; i < len; i++) rtnSprites.push(...sprites)
    rtnSprites.sort(() => Math.random() - .5)
    return rtnSprites
  }

  genBlocks() {
    let blocks = [], sprites = this.createSprites(), count = 0
    let { rows, cols, blockSize: w, blockSpace: space } = this
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let x = (w + space) * (col - 1) + space + w / 2
        let y = (w + space) * (row - 1) + space + w / 2
        if ((col === 0 && row === 0) || 
          (col === cols - 1 && row === 0) || 
          (col === 0 && row === rows - 1) || 
          (col === cols - 1 && row === rows - 1)) {
          blocks.push(null)
        } else if (col === 0) {
          blocks.push({ row, col, num: 0, x: 0, y, w: w / 2, h: w })
        } else if (col === cols - 1) {
          blocks.push({ row, col, num: 0, x, y, w: w / 2, h: w })
        } else if (row === 0) {
          blocks.push({ row, col, num: 0, x, y: 0, w, h: w / 2 })
        } else if (row === rows - 1) {
          blocks.push({ row, col, num: 0, x, y, w, h: w / 2 })
        } else {
          let { dx, dy, dw } = sprites[count]
          blocks.push({ row, col, dx, dy, dw, num: 1, x, y, w, h: w })
          count++
        }
      }
    }
    return blocks
  }

  rinse() {
    this.selBlock = null
    let coords = [], count = 0
    this.blocks.forEach(_ => _ && _.dw && _.num && coords.push({ dx: _.dx, dy: _.dy }))
    coords.sort(() => Math.random() - .5)
    for (let i = 0; i < this.blocks.length; i++) {
      let _ = this.blocks[i]
      if (_ && _.dw && _.num) {
        _.dx = coords[count].dx
        _.dy = coords[count].dy
        count++
      }
    }
    this.drawUI()
  }

  drawUI() {
    this.context.clearRect(0, 0, this.width, this.height)
    this.blocks.forEach(_ => {
      _ && _.num && this.context.drawImage(this.img, _.dx, _.dy, _.dw, _.dw, _.x, _.y, _.w, _.h)
    })
    if (this.selBlock) this.drawArc(this.selBlock)
  }

  drawArc(block, alpha = .6) {
    this.context.save()
    this.context.fillStyle = `rgba(0, 0, 0, ${alpha})`
    this.context.beginPath()
    this.context.arc(...this.getCenter(block), block.w / 2, 0, Math.PI * 2)
    this.context.closePath()
    this.context.fill()
    this.context.restore()
  }

  drawJoinLines(blocks) {
    let { context, selBlock: b1, pixRatio } = this, b2 = blocks[0]
    if (blocks.length === 1 && (Math.abs(b1.row - b2.row) === 1 || Math.abs(b1.col - b2.col) === 1)) return
    context.save()
    context.strokeStyle = '#555'
    context.lineWidth = pixRatio
    context.beginPath()
    context.moveTo(...this.getCenter(b1))
    blocks.forEach(_ => this.context.lineTo(...this.getCenter(_)))
    context.stroke()
    context.restore()
  }

  getCurBlock(event) {
    let ex = (event.offsetX || event.pageX) * this.pixRatio
    let ey = (event.offsetY || event.pageY) * this.pixRatio
    return this.blocks.find(_ => {
      if (!_) return
      let x = _.x + _.w / 2
      let y = _.y + _.h / 2
      return _.num && (ex - x) * (ex - x)+(ey - y) * (ey - y) < _.w * _.h / 4
    })
  }
}

export default Game
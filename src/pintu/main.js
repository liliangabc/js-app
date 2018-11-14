/**
 * 拼图游戏
 * author: liliang
 */

import fs from 'fs'
import utils from '../utils'

utils.createStyleSheet(fs.readFileSync(__dirname + '/style.css', 'utf8'))

class Block {
  constructor({ row, col }) {
    this.row = row
    this.col = col
  }

  draw({ context, size, space }) {

  }
}

class Board {
  constructor(mountEl, callbacks = {}) {

  }

  initUI({ rows, cols }) {
    
  }
}
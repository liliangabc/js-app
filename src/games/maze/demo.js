/**
 * 走出迷宫demo
 * author: liliang
 */

import Game from './index'
let options = { cols: 20 }
const game = new Game(null, {
  onDone() {
    if (confirm('恭喜！你找到出口了！要挑战更高难度吗？')) {
      options.cols += 2
    }
    game.initUI(options)
  }
})
game.initUI(options)
if ('ontouchstart' in document) game.createMobController()
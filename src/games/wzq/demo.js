/**
 * 人家大战五子棋demo
 * author: liliang
 */

import Game from './index'

const game = new Game(null, {
  onGameover(num) {
    alert(`游戏结束：${num === 1 ? '白' : '黑'}方获胜！`)
    game.initUI()
  }
})
game.initUI()
/**
 * 连连看测试demo
 * author: liliang
 */

import Game from './index'
import source from './img/sprite.png'

let options = {
  cols: 8,
  imgOptions: { src: source, rows: 4, cols: 4 }
}

const game = new Game('#gameDemo', {
  onDone() {
    if (confirm('恭喜，你完成了！要重新开始吗？')) {
      game.initUI(options)
    }
  }
})
game.initUI(options)

const btnRestart = document.getElementById('btnRestart')
const btnRinse = document.getElementById('btnRinse')

btnRestart.addEventListener('click', event => {
  game.initUI(options)
})

btnRinse.addEventListener('click', event => {
  game.rinse()
})
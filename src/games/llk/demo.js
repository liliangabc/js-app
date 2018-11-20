/**
 * 连连看测试demo
 * author: liliang
 */

import Game from './index'
import source from './img/sprite.png'

const game = new Game('#gameDemo', {

})
game.initUI({ 
  cols: 8, 
  imgOptions: {
    src: source,
    rows: 4,
    cols: 4
  }
})
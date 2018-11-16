import MineController from './index'

let options = { cols: 9, rows: 9, mineCount: 10 }

const controller = new MineController(null, {
  onWinning() {
    alert('恭喜你！你胜利了！')
    options.mineCount += 4
    options.rows += 1
    controller.start(options)
  },
  onOver() {
    alert('不好意思，你挂了！')
    controller.start(options)
  },
  onUpdate(state) {
    console.log(state)
  }
})

controller.start(options)
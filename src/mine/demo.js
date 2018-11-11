import MineController from './index'

const controller = new MineController(null, {
  onWinning() {
    console.log('恭喜你！你胜利了！')
  },
  onOver() {
    console.log('不好意思，你挂了！')
  },
  onUpdate(state) {
    console.log(state)
  }
})

controller.start({ cols: 9, mineCount: 10 })
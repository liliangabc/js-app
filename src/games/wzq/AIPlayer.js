class AIPlayer {
  constructor(game) {
    this.game = game
  }

  play() {
    let pos = null, score = 0
    this.game.chessData.forEach(_ => {
      if (_.num) return
      let curScore = this.judge(_)
      if (curScore > score) {
        score = curScore
        pos = _
      }
    })
    return pos
  }

  judge(pos) {
    let a = parseInt(this.LR(pos, 1)) + parseInt(this.TB(pos, 1)) + parseInt(this.RB(pos, 1)) + parseInt(this.RT(pos, 1))
    let b = parseInt(this.LR(pos, 2)) + parseInt(this.TB(pos, 2)) + parseInt(this.RB(pos, 2)) + parseInt(this.RT(pos, 2))
    return a + b
  }

  getCoords(pos, num) {
    let { row, col } = pos
    return this.game.chessData.map(_ => {
      return { row: _.row, col: _.col, num: _.row === row && _.col === col ? num : _.num }
    })
  }

  LR(pos, num) {
    let death = 0, count = 0, { row, col } = pos, { rows } = this.game
    let coords = this.getCoords(pos, num)
    let arr = coords.filter(_ => _.row <= row && _.col === col)
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].num === num) {
        count++
      } else {
        if (arr[i].num) death += 1
        break
      }
    }
    arr = coords.filter(_ => _.row >= row && _.row < rows && _.col === col)
    for (let i = row; i < arr.length; i++) {
      if (arr[i].num === num) {
        count++
      } else {
        if (arr[i].num) death += 1
        break
      }
    }
    count -= 1
    return this.model(count, death)
  }

  TB(pos, num) {
    let death = 0, count = 0, { row, col } = pos, { cols } = this.game
    let coords = this.getCoords(pos, num)
    let arr = coords.filter(_ => _.col <= col && _.row === row)
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].num === num) {
        count++
      } else {
        if (arr[i].num) death += 1
        break
      }
    }
    arr = coords.filter(_ => _.col >= col && _.col < cols && _.row === row)
    for (let i = col; i < arr.length; i++) {
      if (arr[i].num === num) {
        count++
      } else {
        if (arr[i].num) death += 1
        break
      }
    }
    count -= 1
    return this.model(count, death)
  }

  RB(pos, num) {
    let death = 0, count = 0, { row, col } = pos, { rows, cols } = this.game
    let coords = this.getCoords(pos, num)
    for (let i = row, j = col; i >= 0 && j >= 0;) {
      let _ = coords.find(_ => _.row === i && _.col === j)
      if (_.num === num) {
        count++
      } else {
        if (_.num) death += 1
        break
      }
      i--
      j--
    }
    for (let i = row, j = col; i < rows && j < cols;) {
      let _ = coords.find(_ => _.row === i && _.col === j)
      if (_.num === num) {
        count++
      } else {
        if (_.num) death += 1
        break
      }
      i++
      j++
    }
    count -= 1
    return this.model(count, death)
  }

  RT(pos, num) {
    let death = 0, count = 0, { row, col } = pos, { rows, cols } = this.game
    let coords = this.getCoords(pos, num)
    for (let i = row, j = col; i >= 0 && j < cols;) {
      let _ = coords.find(_ => _.row === i && _.col === j)
      if (_.num === num) {
        count++
      } else {
        if (_.num) death += 1
        break
      }
      i--
      j++
    }
    for (let i = row, j = col; i < rows && j >= 0;) {
      let _ = coords.find(_ => _.row === i && _.col === j)
      if (_.num === num) {
        count++
      } else {
        if (_.num) death += 1
        break
      }
      i++
      j--
    }
    count -= 1
    return this.model(count, death)
  }

  model(count, death) {
    var LEVEL_ONE = 0 //单子
    var LEVEL_TWO = 1 //眠2，眠1
    var LEVEL_THREE = 1500 //眠3，活2
    var LEVEL_FOER = 4000 //冲4，活3
    var LEVEL_FIVE = 10000 //活4
    var LEVEL_SIX = 100000 //成5
    if (count === 1 && death == 1) {
      return LEVEL_TWO //眠1
    } else if (count === 2) {
      if (death === 0) {
        return LEVEL_THREE //活2
      } else if (death === 1) {
        return LEVEL_TWO //眠2
      } else {
        return LEVEL_ONE //死棋
      }
    } else if (count === 3) {
      if (death == 0) {
        return LEVEL_FOER //活3
      } else if (death === 1) {
        return LEVEL_THREE //眠3
      } else {
        return LEVEL_ONE //死棋
      }
    } else if (count === 4) {
      if (death === 0) {
        return LEVEL_FIVE //活4
      } else if (death === 1) {
        return LEVEL_FOER //冲4
      } else {
        return LEVEL_ONE //死棋
      }
    } else if (count === 5) {
      return LEVEL_SIX //成5
    }
    return LEVEL_ONE
  }
}

export default AIPlayer
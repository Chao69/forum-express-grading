module.exports = {
  ifCond: function (a, b, option) {
    if(a === b) {
      return option.fn(this)
    }
    return option.inverse(this)
  }
}
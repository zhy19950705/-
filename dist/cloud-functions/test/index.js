
// 这个云函数将传入的 a 和 b 相加返回
exports.main = async (event, context) => {
  let { a, b } = event
  debugger
  return new Promise((resolve, reject) => {
    resolve({ result: parseInt(a) + parseInt(b) })
  })
}
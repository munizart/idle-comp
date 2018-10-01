const global = (function () {
  return this
}())

module.exports.requestIdleCallback = global.requestIdleCallback || ((fn, ...args) => setTimeout(fn, 0, ...args))
module.exports.cancelIdleCallback = global.cancelIdleCallback || clearTimeout

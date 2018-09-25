const global = (function () {
  return this
}())

const requestIdleCallback = global.requestIdleCallback
const cancelIdleCallback = global.cancelIdleCallback
const empty = Symbol.for('EmptyValue')

/**
 * IdleComp = IdleComp
 *            | Computed a'
 *            | Future   a'
 * @namespace IdleComp
 */
const IdleComp = {
  /**
   * @param { a } value A value to get wrapped
   * @return { IdleComp<a> } An IdleComp with a sitting a' inside it.
   * @template a
   */
  of (value) {
    return IdleComp.Computed(value)
  },

  /**
   * @param { a } value A value to get wrapped
   * @return { IdleComp<a> } An IdleComp with a sitting a' inside it.
   * @template a
   */
  Computed (value) {
    return {
      /**
       * get the value out of wrapping
       * @memberof IdleComp.Computed#
       * @return { a } the value that was sitting insed
       */
      fold () {
        return value
      },

      /**
       * @memberof IdleComp.Computed#
       * @param { function (a) : b } fn a mapping satisfying a' -> b'
       * @return { IdleComp.Future<b> } A new IdleComp to resolve into b'
       * @template b
       */
      map (fn) {
        return IdleComp.Future(fn, value)
      }
    }
  },
  /**
   * @param { function ( b ) : a } fn a mapping satisfying a' -> b'
   * @param { b } initialValue A value to get wrapped
   * @return { IdleComp.Future<a> } A new IdleComp to resolve into b'
   * @template a, b
   */
  Future (fn, initialValue) {
    let value = empty
    let _callbackId = requestIdleCallback(() => {
      value = fn(initialValue)
    })

    return {
      /**
       * fold - If the computations are compleated, just return the value.
       * Else, force computation synchronously and then return it's result.
       * @return { a } The value from this computation.
       */
      fold () {
        if (value === empty) {
          cancelIdleCallback(_callbackId)
          value = fn(initialValue)
          return value
        } else {
          return value
        }
      },

      /**
       * @param { function (a) : b } fn a mapping satisfying a' -> b'
       * @return { IdleComp.Future<b> } A new IdleComp to resolve into b'
       * @template b
       */
      map (fn) {
        return IdleComp.Future(() => {
          return fn(this.fold())
        })
      }
    }
  }
}

module.exports = IdleComp

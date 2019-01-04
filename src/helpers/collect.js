/**
 * This function is used for collecting values into the array.
 * @param {string} val The new value to be pushed into the array
 * @param {array} arr The original array
 * @return {array} The new array
 */
module.exports = (val, arr) => {
  arr.push(val)
  return arr
}

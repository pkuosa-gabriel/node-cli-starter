module.exports = numbers => {
  /**
   * `Array.prototype.reduce()` executes the reducer function on each member of the array,
   * resulting in a single output value.
   */
  console.log(
    numbers.reduce(
      (accumulator, currentValue) =>
        parseFloat(accumulator) + parseFloat(currentValue),
    ),
  )
}

module.exports = (first, second, coefficient = 1, cmd) => {
  let result = Math.abs(first.length - second.length)
  if (cmd.random) {
    result += Math.random()
  }
  result *= coefficient
  console.log(`The match point of ${first} and ${second} is ${result}`)
}

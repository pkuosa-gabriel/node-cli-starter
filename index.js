// index.js

/**
 * This is the common way to import a package in NodeJS.
 * The CommonJS module system is used.
 */

const mycli = require('commander')

/**
 * This arrow function is used for generating our bot's replies.
 * @param {string} word The intended output
 */
const bot = word => {
  console.log('The bot says:', word)
}

/**
 * This function is used for collecting values into the array.
 * @param {string} val The new value to be pushed into the array
 * @param {array} arr The original array
 * @return {array} The new array
 */
const collect = (val, arr) => {
  arr.push(val)
  return arr
}

/**
 * Without using `.command`, this works as the root command.
 */
mycli
  .option('-u, --username <name>', `specify the user's name`)
  .option('-a, --age [age]', `specify the user's age`)
  .option(
    '-g, --gender [gender]',
    `specify the user's gender`,
    /^(male|female)$/i,
    'private',
  )
  .option('-i, --additional-info [info]', 'additional information', collect, [])
  .option('-s, --silent', 'disable output')
  .option('--no-gender-output', 'disable gender output')
  .action(() => {
    if (!mycli.silent) {
      /**
       * `...` is called a template string (aka template literal). Expressions can be evaluated in a
       * template string, by using ${}, which is very similar to what we do in command line with shell
       * scripts.
       * Here we use JS's internal function typeof to get the variable's type.
       * We also use ternary operator instead of if ... else ... for simplicity.
       */
      const nameLine = `Hello ${
        typeof mycli.username === 'string' ? mycli.username : 'world'
      }`
      bot(nameLine)

      const ageLine =
        typeof mycli.age === 'string'
          ? `I know you are ${mycli.age}`
          : 'I do not know your age'
      bot(ageLine)

      /**
       * Here we combine use of arrow function and IIFE (Immediately Invoked Function Expression).
       */
      if (mycli.genderOutput) {
        const genderLine = (() => {
          switch (mycli.gender) {
            case 'male':
              return 'You are a man'
            case 'female':
              return 'You are a woman'
            default:
              return 'Well, gender is your privacy'
          }
        })()
        bot(genderLine)
      }

      /**
       * Array.forEach is an easy way to perform iterative execution to all elements in an array.
       */
      mycli.additionalInfo.forEach(info => {
        const infoLine = `I also know ${info}`
        bot(infoLine)
      })
    }
  })

mycli
  .command('time')
  .alias('t')
  .description('show the current local time')
  .action(() => {
    /**
     * The `Date.now()` method returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
     * By using `new Date()`, a Date object is created.
     * The `.toLocaleTimeString()` method then transforms it into the human readable form.
     */
    const now = new Date(Date.now())
    console.log(now.toLocaleTimeString())
  })

mycli
  .command('sum')
  .alias('s')
  .arguments('<numbers...>')
  .description('calculate sum of several numbers')
  .action(numbers => {
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
  })

mycli
  .command('match')
  .alias('m')
  .arguments('<first> <second> [coefficient]')
  .option('-r, --random', 'add a random value to the final result')
  .description('calculate how much the first person matches the second one')
  .action((first, second, coefficient = 1, cmd) => {
    let result = Math.abs(first.length - second.length) / 1.0
    if (cmd.random) {
      result += Math.random()
    }
    result *= coefficient
    console.log(`The match point of ${first} and ${second} is ${result}`)
  })

/**
 * This line is necessary for the command to take effect.
 */
mycli.parse(process.argv)

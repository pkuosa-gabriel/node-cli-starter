const bot = require('../helpers/bot')

module.exports = cmd => {
  if (!cmd.silent) {
    /**
     * `...` is called a template string (aka template literal). Expressions can be evaluated in a
     * template string, by using ${}, which is very similar to what we do in command line with shell
     * scripts.
     * Here we use JS's internal function typeof to get the variable's type.
     * We also use ternary operator instead of if ... else ... for simplicity.
     */
    const nameLine = `Hello ${
      typeof cmd.username === 'string' ? cmd.username : 'world'
    }`
    bot(nameLine)

    const ageLine =
      typeof cmd.age === 'string'
        ? `I know you are ${cmd.age}`
        : 'I do not know your age'
    bot(ageLine)

    /**
     * Here we combine use of arrow function and IIFE (Immediately Invoked Function Expression).
     */
    if (cmd.genderOutput) {
      const genderLine = (() => {
        switch (cmd.gender) {
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
    cmd.additionalInfo.forEach(info => {
      const infoLine = `I also know ${info}`
      bot(infoLine)
    })
  }
}

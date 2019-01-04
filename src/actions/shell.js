const shelljs = require('shelljs')

module.exports = () => {
  shelljs.ls('-Al').forEach(file => {
    const birthTimeUTC = new Date(file.birthtimeMs).toUTCString()
    console.log(`${file.name} was created at ${birthTimeUTC}.`)
  })
}

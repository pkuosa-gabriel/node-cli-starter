// index.js

/**
 * This is the common way to import a package in NodeJS.
 * The CommonJS module system is used.
 */

const mycli = require('commander')

/**
 * () => {} is a lambda function, which belongs to the ES6 (ESMAScript 6) standard.
 */
mycli.action(() => {
  console.log('Hello world') // Print 'Hello world' to the command line.
})

/**
 * This line is necessary for the command to take effect.
 */
mycli.parse(process.argv)

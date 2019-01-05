#!/usr/bin/env node
// index.js

/**
 * This is the common way to import a package in NodeJS.
 * The CommonJS module system is used.
 */

const mycli = require('commander')
const mainAction = require('./src/actions/index')
const timeAction = require('./src/actions/time')
const sumAction = require('./src/actions/sum')
const matchAction = require('./src/actions/match')
const shellAction = require('./src/actions/shell')
const collect = require('./src/helpers/collect')
const {version} = require('./package')

/**
 * Without using `.command`, this works as the root command.
 */
mycli
  .version(version, '-v, --version')
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

mycli
  .command('time')
  .alias('t')
  .description('show the current local time')
  .action(timeAction)

mycli
  .command('sum')
  .alias('s')
  .arguments('<numbers...>')
  .description('calculate sum of several numbers')
  .action(sumAction)

mycli
  .command('match')
  .alias('m')
  .arguments('<first> <second> [coefficient]')
  .option('-r, --random', 'add a random value to the final result')
  .description('calculate how much the first person matches the second one')
  .action(matchAction)

mycli
  .command('shell')
  .description('use shelljs to do some shell work')
  .action(shellAction)

/**
 * Other commands will be redirected to the help message.
 */
mycli.command('*').action(() => mycli.help())

/**
 * This line is necessary for the command to take effect.
 */
mycli.parse(process.argv)

/**
 * Call `mainAction` only when no command is specified.
 */
if (mycli.args.length === 0) mainAction(mycli)

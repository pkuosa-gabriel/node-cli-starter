# Developing your first CLI (command line interface) tool using NodeJS

Most programmers prefer CLI to GUI, why?

- They are smaller in size.
- Batch processing is ease.
- Well-designed auto-completion can prevent incorrect manipulations.
- Using GUI is not cool. (It is true for most geeks.)
- ...And many other reasons I have not come up with yet.

But not so many have actually developed a CLI. Fortunately, with the help of
several handful packages, it has become effortless to build a CLI with NodeJS.

Here is the companion repo of this post:

{% github https://github.com/pkuosa-gabriel/node-cli-starter %}

The main packages we will be using:

- [commander](https://github.com/tj/commander.js)
- [shelljs](https://github.com/shelljs/shelljs)
- [pkg](https://github.com/zeit/pkg)

## Before we start

If you are not familiar with NodeJS, or JavaScript, that is OK, for this
instruction will not be difficult as long as you have some essential programming
experience.

You will need to install some necessary tools, however. If you are using MacOS,
and you already have [homebrew](https://brew.sh/) installed, then it will be as
easy as:

```sh
brew install node yarn # Install node (the NodeJS engine) and yarn (a package manager for NodeJS)
```

You can also use `npm`, which is the official package manager for NodeJS. I use
`yarn` out of personal preference. There are some differences in their usage,
but it is not hard to figure them out via help.

If you are using Linux or Windows, there are plenty of blogs and articles on the
Internet, so you can just go searching for how to install node and yarn on your
system.

After the installation, we can enter our main phase.

## Step 00: Setting up the repository

The fastest way is to clone my repo:

```sh
git clone https://github.com/pkuosa-gabriel/node-cli-starter my-cli
cd my-cli
git checkout step-00-repo-init
yarn install
```

Besides the packages mentioned above, I've also configured
[prettier](https://github.com/prettier/prettier),
[lint-staged](https://github.com/okonet/lint-staged) and
[husky](https://github.com/typicode/husky) for your convenience. If you do not
want or do not like them, just run `yarn remove <package-name>` and delete the
related code, namely, `.prettierrc`, `.lintstagedrc` and the `'husky'` object in
`package.json`.

Or if you want to start from scratch:

```sh
mkdir my-cli
cd my-cli
yarn init # You will need to answer several questions interactively
yarn add commander shelljs
yarn add -D pkg
```

## Step 01: Hello, [commander](https://github.com/tj/commander.js)

Every time you learn something new, there will be some "Hello world" things. And
this time is no exception. Our first goal is to build a command that outputs
"Hello world".

If you are following my repo, you should now checkout to the next branch.

```sh
git checkout step-01-hello-world
```

Or you can edit `index.js` with your favorite IDE:

```javascript
// index.js

/**
 * This is the common way to import a package in NodeJS.
 * The CommonJS module system is used.
 */

const mycli = require('commander')

/**
 * () => {} is an arrow function, which belongs to the ES6 (ESMAScript 6) standard.
 */
mycli.action(() => {
  console.log('Hello world') // Print 'Hello world' to the command line.
})

/**
 * This line is necessary for the command to take effect.
 */
mycli.parse(process.argv)
```

We can then validate it by running:

```sh
node index.js
#=> Hello world

node index.js hello
#=> Hello world
```

Note that extra arguments will make no difference here, as we have not made use
of them yet.

In this code snippet, `action` determines what will be executed after the
command is triggered. However, it will not be executed until `parse` is called,
which parses the input arguments from `process.argv`.

For example, `node index.js` will be parsed to:

```json
Command {
  commands: [],
  options: [],
  _execs: {},
  _allowUnknownOption: false,
  _args: [],
  _name: 'index',
  Command: [Function: Command],
  Option: [Function: Option],
  _events:
   [Object: null prototype] { 'command:*': [Function: listener] },
  _eventsCount: 1,
  rawArgs:
   [ '/usr/local/Cellar/node/11.6.0/bin/node',
     '/path/to/my-cli/index.js' ],
  args: [] }
```

## Step 02: Adding some options

The hello-world version CLI is useless because it ignores whatever we input, and
outputs only 'Hello world'. To make it a little more useful, we are going to add
some options.

```sh
git checkout step-02-add-options
```

Or you can do it manually:

```javascript
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
       * template string, by using ${}, which is very similar to what we do in the command line with shell
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

/**
 * This line is necessary for the command to take effect.
 */
mycli.parse(process.argv)
```

Quite a few changes! Don't be afraid, I will explain them to you one by one.

In total, 6 different options have been added to help you form a comprehensive
view of how to use [commander](https://github.com/tj/commander.js).

Before looking at my explanations, you can have a try first. Just type
`node index.js -h` or `node index.js --help` in your command line, and you will
see an automatically generated help message. You do not need to do anything in
your code, because [commander](https://github.com/tj/commander.js) will take
care of it for you. You can also customize your help message. Details can be
referred to this [part](https://github.com/tj/commander.js#custom-help) of
[commander](https://github.com/tj/commander.js)'s official document.

```txt
Usage: index [options]

Options:
  -u, --username <name>         specify the user's name
  -a, --age [age]               specify the user's age
  -g, --gender [gender]         specify the user's gender (default: "private")
  -i, --additional-info [info]  additional information (default: [])
  -s, --silent                  disable output
  --no-gender-output            disable gender output
  -h, --help                    output usage information
```

Example input:

```sh
node index.js -u Tom -a 18 -g male -i "Michael Jordan is the God of basketball."
```

Example output:

```txt
The bot says: Hello Tom // (name)
The bot says: I know you are 18 // (age)
The bot says: You are a man // (gender)
The bot says: I also know Michael Jordan is the God of basketball. // (additionalInfo)
```

- If a name is given, the bot will starts with "Hello <somebody>", otherwise it
  will simply say "Hello world".
- If an age is given, the bot will retell that by saying "I know you are <age>",
  otherwise it will say "I do not know your age"
- If a gender (male/female) is given, the bot will retell that by saying "You
  are a man/woman", otherwise it will say "Well, gender is your privacy"
- If additional information is given, the bot will simple reply with "I also
  know <the exact information>".

If you are not so familiar with NodeJS or JavaScript, there are some brief
introductions in the comments. For further details, you can turn to
[NodeJS Doc](https://nodejs.org/en/docs/), or other websites like
[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript) and
[w3schools](https://www.w3schools.com/js/).

Now let's see the code. We use `.option()` to add options for our CLI commands.
As a function, it receives several parameters:

1. `flags`: a string like '-u, --username <name>', which specifies how this
   option will be triggered, and whether it has a parameter. This is
   **required**.
2. `description`: A string as the description of this option, which will be
   collected into the auto help message. This is _optional_.
3. `fn`: A function or a regular expression, which will be applied to the input
   parameter of this option. This is _optional_.
4. `defaultValue`: The default value for the parameter of this option. This is
   _optional_.

[commander](https://github.com/tj/commander.js) will transform each option into
a key of the commander object (`mycli` in our case). And it follows the
principles below:

1. If `flags` is set to `-c`, and there is no `--` flag, it will be transformed
   into `mycli.C`.
2. If `--` flag is set, e.g., `--username`, in this case, whether or not the `-`
   flag is set, this option will be transformed into `mycli.username`.
3. If multiple words are used, e.g., `--additional-info`, it will be transformed
   into the camel form, `mycli.additionalInfo`.
4. If an option is not used and no default value is given, its value will be
   `undefined`. If it is used, but no parameter is given, its value will be
   `true`.
5. In particular, if `--no` flag is set, e.g., `--no-gender-output`, it will be
   transformed into `mycli.genderOutput`, while it has a different behavior.
   When using this option, its value will be `false`, and `true` if it is not
   used.
6. If a parameter definition is given via `[]` or `<>`, and a parameter is given
   when using the option, then the value will be the parameter (or the return
   value from `fn`, which takes the parameter as its input), instead of a
   boolean.

> **[Tips]**
>
> - Avoid using `--name`, for `mycli.name` already exists.
> - Avoid using `-c` and `-C` at the same time without setting the `--` flag for
>   them, for they will both be transformed into `mycli.C`. Also avoid using
>   same `--` flag for different options, or things like `--happy` and
>   `--no-happy`. Remember the mechanism of the option=>key transform, then you
>   will never make such a mistake.
> - Besides the 5th point above, options defined with a `--no` flag has another
>   notable feature: It can receive parameters, `fn` can also work, but it
>   ignores the `defaultValue` property. The document does not mention this, but
>   it can be seen in the
>   [source code](https://github.com/tj/commander.js/blob/82d0d0ae6d66163f5c97ce56031b796621bef4ce/index.js#L396),
>   that the `defaultValue` of `--no` options will be rewritten to `true`,
>   ignoring the `defaultValue` you set. So, my suggestion is that you should
>   not define a parameter for a `--no` option.

You may have noticed that two different ways are used to define option
parameter, namely, `[]` and `<>`. The difference lies in that `[]` defines an
optional parameter, while `<>` definess a required parameter. You can experience
it by typing `node index.js -u` in the command line. There will be an error,
saying:

```txt
error: option `-u, --username <name>' argument missing
```

This is because the `-u` option has a required parameter. As long as you use
this option, you must give it a parameter. Otherwise an error will occur.

> **[Tips]**
>
> - Be careful not to offer the required parameter when using an option which
>   requires a parameter. For instance, when you run `node index.js -u -a`, the
>   `-a` option will not be triggered, for the "-a" you input will be recognized
>   as the parameter of `-u`.

The `-g, --gender` option has a regular expression as its `fn`, which matches
only "male" or "female". This means, when the parameter of `-g` is neither
"male" nor "female", it will fall into the default value "private".

> **[Tips]**
>
> - Make sure to set the default value when using a regular expression. In the
>   example above, if no default value is given, and you input a parameter other
>   than "male" or "female", the value of `mycli.gender` will be `true`, which
>   you might not expect.

The `-i, --additional-info` option has a processing function called `collect`
which is defined as:

```javascript
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
```

This function simply collects the new value and push it into the original array.
Combined with the default value `[]`, this option is able to be called multiple
times, and collect all the parameters into an array.

Example input:

```sh
node index.js -i "the sun rises in the east" -i "the sun sets in the west"
```

Example output:

```txt
The bot says: Hello world // (username)
The bot says: I do not know your age // (age)
The bot says: Well, gender is your privacy // (gender)
The bot says: I also know the sun rises in the east // (additionalInfo)
The bot says: I also know the sun sets in the west // (additionalInfo)
```

The last two lines correspond to the two sentences we input.

What will happen if we do not use the `collect` function and set the default
value to `[]`? We can use `-u` to test this.

Example input:

```sh
node index.js -u Tom -u Mary -u Mike
```

Example output:

```txt
The bot says: Hello Mike // (name)
The bot says: I do not know your age // (age)
The bot says: Well, gender is your privacy // (gender)
```

As you can see, the last `-u` option overwrites all previous `-u` options.

> **[Tips]**
>
> - If the last `-u` option has no parameter, there will be en error, even if
>   all the previous `-u` options have parameters given, for they have been
>   overridden.

The `-s, --silent` option diables all outputs as its description says, for all
the `bot` functions (which is a wrapped `console.log`) rely on `mycli.silent`
being false.

The `--no-gender-output` option diables only the gender line.

Before we go to the next step, I want to mention that
[commander](https://github.com/tj/commander.js) supports the abbreviation of `-`
flags. But be careful when you try to use that!

Example input:

```sh
node index.js -uagi Tom 18 male "Michael Jordan is the God of basketball."
```

Example output:

```txt
The bot says: Hello -a // (name)
The bot says: I do not know your age // (age)
The bot says: Well, gender is your privacy // (gender)
The bot says: I also know Tom // (additionalInfo)
```

On first sight you might find the output rather strange. But if you know how it
works, you will understant at once.

The mechanism of abbreviation is very simple. The abbreviated options will
simply be expanded before being evaluated. So the original input becomes:

```sh
node index.js -u -a -g -i Tom 18 male "Michael Jordan is the God of basketball."
```

- `-u` takes "-a" as its parameter, so the first line of output is "Hello -a"
- `-g` has no parameter, so the default value "private" is used.
- `-i` takes "Tom" as its parameter, and the rest parameters are abandoned.

OK, now you have realized a simple CLI tool, and also got to know some
mechanisms behind the surface. Congratulations! Lets move on to the next step.

## Step 03: Adding sub-commands

A CLI tool generally has multiple commands. In this step, we will add some
sub-commands to our CLI tool.

```sh
git checkout step-03-add-subcommands
```

Or modify your `index.js` manually:

```javascript
// index.js

// ...

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
    let result = Math.abs(first.length - second.length)
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
```

We add three commands, respectively, `time`, `sum` and `match`.

First, let's have a look at our the help message.

```sh
node index.js -h
```

The output should be:

```txt
Usage: index [options] [command]

Options:
  -u, --username <name>                             specify the user's name
  -a, --age [age]                                   specify the user's age
  -g, --gender [gender]                             specify the user's gender (default: "private")
  -i, --additional-info [info]                      additional information (default: [])
  -s, --silent                                      disable output
  --no-gender-output                                disable gender output
  -h, --help                                        output usage information

Commands:
  time|t                                            show the current local time
  sum|s <numbers...>                                calculate sum of several numbers
  match|m [options] <first> <second> [coefficient]  calculate how much the first person matches the second one
```

[commander](https://github.com/tj/commander.js) also generates help messages for
the sub-commands. For example:

```sh
node index.js match -h
```

will yield:

```txt
Usage: match|m [options] <first> <second> [coefficient]

calculate how much the first person matches the second one

Options:
  -r, --random  add a random value to the final result
  -h, --help    output usage information
```

Defining sub-commands is easy:

1. `.command()` specifies the name of the sub-command
2. `.alias()` specifies the alias of the sub-command
3. `.description()` specifies the description, which is shown in the help
   message.
4. `.arguments()` defines what arguments the sub-command will accept
5. `.action()` defines the action after a sub-command is triggered

The `time` command has no arguments, so we simply do:

```sh
node index.js time

# Or `node index.js t`
# For it has the alias "t"
```

The current time will be printed, for example:

```txt
11:02:41 PM
```

The `sum` command requires at least one parameter. This is realized via
`.arguments('<numbers...>')`. Just like we have been familiar in Step 02, here
the `<>` means this parameter is required. Then what does the `...` mean? This
means there can be more than one parameter.

Let's have a try:

```sh
node index.js sum 1 2 3 4 5.1
```

The output will be:

```txt
15.1
```

As is shown above, the `sum` command takes all the five numbers we input. These
numbers are loaded into an array called `numbers`, which we can directly use in
the context of `.action()`.

The `match` command has two required parameters, `<first>` and `<second>`, and
an optional parameter, `coefficient`. It also has an option `-r, --random`.

Let's have a go:

```sh
node index.js match Tom Mary 1.2 -r
```

Example output (the result varies because we use random numbers here):

```txt
The match point of Tom and Mary is 2.0254795433768233
```

The `.arguments` part is not hard to understand. However, the `.action()` part
does require your attention, for there is something different from what we
already know.

I have copied the code below, so you do not need to scroll up.

```javascript
.action((first, second, coefficient = 1, cmd) => {
    let result = Math.abs(first.length - second.length)
    if (cmd.random) {
      result += Math.random()
    }
    result *= coefficient
    console.log(`The match point of ${first} and ${second} is ${result}`)
  })
```

`coefficient` is an optional parameter, so a default value is assigned to it so
as to avoid the case of `undefined`.

Unlike what we have done in Step 02, as this is the context of a sub-command, we
cannot directly use `mycli.xxx`. Instead, we pass the `cmd` to the function, and
use `cmd.random` to get the value of the `-r, --random` option. Besides this,
you can use options in the same way.

## Step 04: Using [shelljs](https://github.com/shelljs/shelljs)

Till now, our CLI tool is barely a toy. In this step, we will make it more
useful through the use of [shelljs](https://github.com/shelljs/shelljs), which
is very helpful if you want to run shell commands in NodeJS. You can certainly
go without it, but then you will have to deal with things like post-processing
of outputs.

```sh
git checkout step-04-use-shelljs
```

Or modify your `index.js` manually:

```javascript
// index.js

const mycli = require('commander')
const shelljs = require('shelljs')

// ...

mycli
  .command('shell')
  .description('use shelljs to do some shell work')
  .action(() => {
    shelljs.ls('-Al').forEach(file => {
      const birthTimeUTC = new Date(file.birthtimeMs).toUTCString()
      console.log(`${file.name} was created at ${birthTimeUTC}.`)
    })
  })

/**
 * This line is necessary for the command to take effect.
 */
mycli.parse(process.argv)
```

A new sub-command named `shell` has been added. Using `shelljs.ls()` with the
`-Al` option, this sub-command can list all files and directories in the current
directory and tell us the time they each were created, respectively.

```sh
node index.js shell
```

Example output:

```txt
.git was created at Thu, 03 Jan 2019 10:09:05 GMT.
.gitignore was created at Thu, 03 Jan 2019 10:09:13 GMT.
.lintstagedrc was created at Thu, 03 Jan 2019 11:36:11 GMT.
.prettierrc was created at Thu, 03 Jan 2019 11:36:11 GMT.
LICENSE was created at Thu, 03 Jan 2019 10:09:13 GMT.
README.md was created at Thu, 03 Jan 2019 10:09:13 GMT.
index.js was created at Fri, 04 Jan 2019 15:17:22 GMT.
node_modules was created at Thu, 03 Jan 2019 10:11:06 GMT.
package.json was created at Thu, 03 Jan 2019 11:36:11 GMT.
yarn.lock was created at Thu, 03 Jan 2019 11:36:11 GMT.
```

Detailed usage of shelljs can be found in its
[doc](http://documentup.com/shelljs/shelljs).

> **[Tips]**
>
> - There is another package called [shell.js](http://shelljs.io), which is used
>   to render an interactive shell in a web page. Do not mix it up with
>   [shelljs](https://github.com/shelljs/shelljs).

## Step 05: Refactoring the directory structure

Our code is a bit dirty right now. Let's make it prettier through refactoring.

Git checkout is recommended this time, for there are many modifications.

```sh
git checkout step-05-refactor
```

Let's look at our new `index.js`:

```javascript
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
```

As you can see, all actions are moved to the directory `./src/actions`, and
helper functions are moved to the directory `./src/helpers`.

We read `version` from `package.json` and use `.version()` to define the version
of our CLI tool. Now you can type in `node index.js -v`, and the output will be:

```txt
1.0.0
```

which is defined in our `package.json`

Another modification is the `*` sub-command. By using a wildcard, it can match
all the other sub-commands that match none of the above sub-commands. Then we
redirect them to the help message by using internal `mycli.help()`.

We deal with the root command at the end, even after `mycli.parse`. Why?

We forget to test the usability of our root command in Step 03 and Step 04. Now
go back and have a try, and you will find that `node index.js -u Tom -a 18` will
not provide the output we expect, unless you add something else, e.g.,
`node index.js hello -u Tom -a 18`.

> **[Tips]**
>
> - When sub-commands are specified, the `.action()` of the root command will
>   act as if it belongs to a `*` sub-command.
> - If the `*` sub-command is also defined, the `.action()` of the root command
>   will simply be ignored.

So we move the execution of the main action to the end of `index.js`, after
`mycli.parse()` is called.

Then why do we need the `mycli.args.length === 0` condition? You can remove
that, and you will find that the main action will be executed even if we are
using other sub-commands! That is definitely not what we want. By using
`mycli.args.length === 0`, the main action will only take effect when there is
no sub-command.

> **[Tips]**
>
> - You might wonder what will happen if the root command requires an argument.
> - The answer is that it will not take effect, because it will be considered to
>   be a sub-command, instead of an argument of the root command.

## Step 06: Packaging the CLI via [pkg](https://github.com/zeit/pkg)

For the last part, we are going to package the CLI into an executable binary.
With the help of [pkg](https://github.com/zeit/pkg), it is quite easy to package
a NodeJS project into binaries for different platforms.

```sh
git checkout step-06-package
```

Several scripts have been added to `package.json`:

```json
"scripts": {
    "package:mac": "pkg mycli.js --targets node10-macos-x64 --output dist/mac/mycli",
    "package:win": "pkg mycli.js --targets node10-win-x64 --output dist/win/mycli.exe",
    "package:linux": "pkg mycli.js --targets node10-linux-x64 --output dist/linux/mycli",
    "package:all": "yarn package:mac && yarn package:win && yarn package:linux"
  }
```

They are used to package our CLI tool for different NodeJS versions, platforms
and architectures.

> **[Tips]**
>
> - You may have noticed that `index.js` has been renamed to `mycli.js`, this is
>   to make the output of the help message match the name we expect. It uses the
>   name of the main JS file as the name of the CLI tool.

Now, try packaging a binary for your platform, and have a go with the packaged
binary. The most exciting thing is that this binary is even independent of
`node`!

## Step 07: Publishing your CLI tool to NPM

```sh
git checkout step-07-publish
```

This time, changes have been made to `package.json`:

```json
  "name": "@pkuosa-gabriel/node-cli-starter",
  "bin": {
    "mycli": "./mycli.js"
  },
```

There are two key points:

1. Rename the `name` property to the form "@organization/package-name".
2. Add the `bin` property to specify binaries for this package.

Also do not forget to add the following line at the start of `mycli.js`:

```javascript
#!/usr/bin/env node
```

So that the system knows to execute `mycli.js` with `node`.

To publish the package, you will need to register an account, create an
organization, and then login locally. After all have been done, simply run:

```sh
yarn publish
# Or `npm publish`
```

Your package will soon be published to NPM.

You can then run `yarn global add @organization/package-name`, and you should
then be able to use `mycli` in your command line. Hurray!

This tutorial has come to an end. Thank you for reading!

---

## Step 0x [Optional]: Adding logs via [winston](https://github.com/winstonjs/winston)

If you want to further improve your CLI tool, it is a wise idea to make logs
more organized. Here, we will use
[winston](https://github.com/winstonjs/winston) as our logging framework. Want
some colors? You can use [chalk](https://github.com/chalk/chalk).

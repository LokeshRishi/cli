"use strict";

const chalk = require("chalk");
const markoCreate = require(".");

exports.parse = function parse(argv) {
  var options = require("argly")
    .createParser({
      "--help -h": {
        type: "string",
        description: "Show this help message"
      },
      "--dir -d": {
        type: "string",
        description: "Directory to create the marko app in",
        defaultValue: process.cwd()
      },
      "--name -n *": {
        type: "string",
        description: "Name of the new app (with optional source)"
      },
      "--example -e": {
        type: "string",
        description: "Name of the example to use"
      }
    })
    .usage(
      `${chalk.bold.underline("Usage:")} $0 create ${chalk.green(
        "<app-name>"
      )} ${chalk.dim("[options]")}`
    )
    .example(
      "Create a marko app in the current directory",
      "marko create my-new-app"
    )
    .example(
      "…in a specific directory",
      `marko create my-new-app ${chalk.green.bold("--dir ~/Desktop")}`
    )
    .example(
      "…from a marko example (marko-js/examples/color-picker)",
      `marko create my-new-app ${chalk.green.bold("--example color-picker")}`
    )
    .example(
      "…from a github repo",
      `marko create ${chalk.green.bold("user/repo:")}my-new-app`
    )
    .example(
      "…from a github repo at a specific branch/tag/commit",
      `marko create ${chalk.green.bold("user/repo@commit:")}my-new-app`
    )
    .validate(function(result) {
      let noArgs =
        Object.keys(result).length === 1 && result.dir === process.cwd();
      if (noArgs || result.help) {
        this.printUsage();
        process.exit(0);
      }
    })
    .onError(function(err) {
      this.printUsage();
      console.error(err);
      process.exit(1);
    })
    .parse(argv);

  return options;
};

exports.run = function run(options) {
  return markoCreate.run(options);
};

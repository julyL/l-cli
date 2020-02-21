const ora = require('ora');
const child_process = require('child_process');
const copyFile = require('../utils/copyFile');

module.exports = function() {
  let spinner;
  let command = `cnpm install prettier --save-dev`;
  spinner = ora(command).start();
  child_process.exec(command, (err) => {
    if (err) {
      spinner.fail(`install fail: ${err.message}`);
    } else {
      spinner.succeed('install succeed!');
      copyFile('.prettierrc.js');
      copyFile('.prettierignore');
    }
  });
};

const path = require('path');
const fs = require('fse');
const inquirer = require('inquirer');
const template = path.resolve(__dirname, './template');

module.exports = ({ dir }) => {
  if (!dir) {
    dir = process.cwd();
  }
  inquirer
    .prompt([
      {
        type: 'checkbox',
        message: '选择模板类型',
        name: 'type',
        choices: ['vue'],
        validate: function(answer) {
          if (answer.length < 1) {
            return '必需选择一个';
          }
          return true;
        }
      }
    ])
    .then((answers) => {
      let stuff = path.resolve(template, answers.type[0]);
      console.log(stuff, dir);
      try {
        fs.copydirSync(stuff, dir);
        console.log('create successed!');
      } catch (error) {
        console.log(error);
      }
    });
};

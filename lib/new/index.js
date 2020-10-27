const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const template = path.resolve(__dirname, './template');

let map = {
  miniProgram_page: 'miniProgram/page',
  miniProgram_component: 'miniProgram/component'
};

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
        choices: ['vue', 'miniProgram_page', 'miniProgram_component'],
        validate: function(answer) {
          if (answer.length < 1) {
            return '必需选择一个';
          }
          return true;
        }
      }
    ])
    .then((answers) => {
      let type = answers.type[0];
      let stuff = path.resolve(template, map[type] || type);
      console.log(stuff, dir);
      try {
        fs.copySync(stuff, dir);
        console.log('create successed!');
      } catch (error) {
        console.log(error);
      }
    });
};

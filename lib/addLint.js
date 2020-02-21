const inquirer = require('inquirer');

module.exports = async () => {
  let answers = await inquirer.prompt([
    {
      type: 'checkbox',
      message: '选择Lint,自动生成相应lint配置文件',
      name: 'type',
      choices: [
        {
          name: 'Eslint',
          checked: true
        },
        {
          name: 'Prettier',
          checked: true
        }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return '必需选择一个';
        }
        return true;
      }
    }
  ]);
  answers.type.forEach((lint) => {
    if (lint == 'Prettier') {
      require('./addPrettier')();
    } else if (lint == 'Eslint') {
      require('./addEslint')();
    }
  });
};

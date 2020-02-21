const path = require('path');
const child_process = require('child_process');
const inquirer = require('inquirer');
const ora = require('ora');
const template = path.resolve(__dirname, './template');
const copyFile = require('../../utils/copyFile');

const base_dep = ['eslint', 'babel-eslint', 'eslint-config-alloy'];
const react_dep = ['eslint-plugin-react', ...base_dep];
const vue_dep = ['vue-eslint-parser', 'eslint-plugin-vue', ...base_dep];
const ts_dep = [
  'eslint',
  'typescript',
  '@typescript-eslint/parser',
  '@typescript-eslint/eslint-plugin',
  'eslint-config-alloy'
];
const eslint_map = {
  Javascript: {
    dep: base_dep,
    eslint: path.join(template, 'eslint_base.js')
  },
  Vue: {
    dep: vue_dep,
    eslint: path.join(template, 'eslint_vue.js')
  },
  React: {
    dep: react_dep,
    eslint: path.join(template, 'eslint_react.js')
  },
  Typescript: {
    dep: ts_dep,
    eslint: path.join(template, 'eslint_ts.js')
  }
};

// 根据选项生成Eslint的配置文件
module.exports = async () => {
  let answers = await inquirer.prompt([
    {
      type: 'checkbox',
      message: '选择Eslint模板类型',
      name: 'type',
      choices: ['Javascript', 'Vue', 'React', 'Typescript'],
      validate: function (answer) {
        if (answer.length < 1) {
          return '必需选择一个';
        }
        return true;
      }
    }
  ]);
  let eslint_item = eslint_map[answers.type[0]];
  let dep = eslint_item.dep;
  let spinner;
  let command = `cnpm install ${dep.join(' ')} --save-dev`;
  spinner = ora(command).start();
  child_process.exec(command, (err) => {
    if (err) {
      spinner.fail(`install fail: ${err.message}`);
    } else {
      spinner.succeed('install succeed!');
      copyFile(eslint_item.eslint, path.join(process.cwd(), '.eslintrc.js'));
      copyFile(path.join(__dirname, '../../.eslintignore'), path.join(process.cwd(), '.eslintignore'));
    }
  });
};

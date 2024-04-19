const inquirer = require('inquirer');

module.exports = async ({ message = '是否进行删除' }) => {
  let answers = await inquirer.prompt([
    {
      type: 'list',
      message,
      name: 'chosice',
      choices: ['是', '否']
    }
  ]);
  return new Promise((resolve, reject) => {
    resolve(answers.chosice === '是' ? 1 : 0);
  });
};

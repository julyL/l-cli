#! /usr/bin/env node
const program = require('commander');
const path = require('path');
const errorHandle = require('./utils/errorHandle');
const inquirer = require('inquirer');

errorHandle();

let package = require(path.join(__dirname, './package.json'));

program.on('command:*', function() {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' ')
  );
  process.exit(1);
});

// program.version(package.version, '-v, --version', 'output the current version');

// program.name('l-cli').usage('<command> [options]');

program
  .command('start')
  .description('修改package.json集成pre-commit钩子进行Eslint、prettier代码验证')
  .action(() => {
    join('./lib/init')();
  });

program
  .command('lint')
  .description('添加Eslint、Prettier代码检测')
  .action(() => {
    join('./lib/addLint')();
  });

program
  .command('mock <dir> [port]')
  .description('在指定端口启动mock服务，默认端口=8000')
  .action((dir, port) => {
    join('./lib/mock')({
      dir,
      port
    });
  });

program
  .command('tinypng [pattern] [suffix]')
  .description('匹配图片进行压缩处理,默认添加后缀_tiny')
  .action((pattern, suffix) => {
    join('./lib/tinypng')({
      pattern,
      suffix
    });
  });

program
  .command('rmsuffix [pattern] [suffix]')
  .description('去除tinypng产生的后缀,默认去除_tiny')
  .action((pattern, suffix) => {
    join('./lib/removeSuffix')({
      pattern,
      suffix
    });
  });

program
  .command('webp [pattern] [stuff] [quality]')
  .description('将图片格式转换为webp')
  .action((pattern, suffix) => {
    join('./lib/towebp')({
      pattern,
      suffix
    });
  });

program
  .command('unitTo [pattern] ')
  .description('对文本中指定格式的单位进行转换,如：1rem=100px')
  .action((pattern) => {
    inquirer.prompt([
      {
        type: 'input',
        message: '请输入转换规则:如 1rem=100px\n',
        name: 'type',
        validate: function(answer) {
          var done = this.async();
          let validateRegex = /^([^a-zA-Z]+)([a-zA-Z]+)\s*=\s*([^a-zA-Z]+)([a-zA-Z]+)$/;
          let m = answer.match(validateRegex);
          if (m) {
            join('./lib/convertUnit')({
              pattern,
              ratio: m[3] / m[1],
              originUnit: m[2],
              targetUnit: m[4]
            })
              .then(() => {
                done(null, true);
              })
              .catch((err) => {
                done('处理异常:' + err);
              });
          } else {
            done('请输入有效规则如：1rem=100px');
          }
        }
      }
    ]);
  });

program
  .command('new [dir]')
  .description('新建样本文件')
  .action((dir) => {
    join('./lib/new')({
      dir
    });
  });

program.parse(process.argv);

function join(file) {
  return require(path.join(__dirname, file));
}

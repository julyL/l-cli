#! /usr/bin/env node
const program = require('commander');
const path = require('path');
const errorHandle = require('./utils/errorHandle');

errorHandle();

let package = require(path.join(__dirname, './package.json'));

program.parse(process.argv);

if (program.args.length === 0) {
  program
    .name('l-cli')
    .usage('<command> [options]')
    .outputHelp();
}

program.on('command:*', function() {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    program.args.join(' ')
  );
  process.exit(1);
});

program.version(package.version, '-v, --version', 'output the current version');

program.name('l-cli').usage('<command> [options]');

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
  .command('px2rem [pattern] [ratio]')
  .description('css单位 px转化为rem, 默认ratio=100, 100px => 1rem')
  .action((pattern, ratio) => {
    join('./lib/px2rem')({
      pattern,
      ratio
    });
  });

program
  .command('rem2px [pattern] [ratio]')
  .description('css单位 rem转化为px, 默认ratio=100, 1rem => 100px')
  .action((pattern, ratio) => {
    join('./lib/rem2px')({
      pattern,
      ratio
    });
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

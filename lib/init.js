const fs = require('fs');
const path = require('path');
const mixin = require('mixin-deep');
const addLint = require('./addLint.js');

module.exports = function() {
  rewritePackageJson();
  addLint();
};

// 合并pre-commit相关配置到package.json文件
function rewritePackageJson() {
  let packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    let content = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    let mergeJson = {
      husky: {
        hooks: {
          'pre-commit': 'lint-staged'
        }
      },
      'lint-staged': {
        '*.{js,vue,jsx,ts}':
          'prettier --write *.{js,vue,jsx,ts} && eslint --fix'
      },
      devDependencies: {
        husky: '^3.0.0',
        'lint-staged': '^10.0.7'
      }
    };
    content = mixin(content);
    fs.writeFileSync(packagePath, JSON.stringify(content, null, 2));
  } else {
    console.log('需在含有package.json文件的目录下执行');
  }
}

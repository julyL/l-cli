const path = require('path');
const fs = require('fs-extra');
/**
 * 拷贝fromDir下的filename到toDir
 * @param {String} filename
 * @param {String} fromDir 拷贝目录默认为当前项目最外层目录
 * @param {String} toDir  默认拷贝到process.cwd()
 */
module.exports = (filename, fromDir, toDir) => {
  fromDir = fromDir || path.join(__dirname, '../');
  toDir = toDir || process.cwd();
  let file = path.join(toDir, filename);
  if (fs.existsSync(file)) {
    console.log(`本地已存在，${file}将被重写`);
  }
  fs.writeFileSync(
    file,
    fs.readFileSync(path.join(fromDir, filename), 'utf-8'),
    'utf-8'
  );
};

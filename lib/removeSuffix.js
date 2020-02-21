// 移除文件后缀, xx_{后缀}.png => xx.png
const fs = require('fs');
const path = require('path');
const glob = require('glob');

module.exports = async function({ pattern, suffix = '_tiny' }) {
  if (!pattern) {
    pattern = `**/*${suffix}.{jpg,jpeg,png}`;
  }
  let fileList = glob.sync(pattern, {
    ignore: '**/node_modules/**'
  });
  fileList.forEach((file) => {
    let d = path.parse(file);
    let newfile = path.join(
      d.dir,
      d.name.replace(new RegExp(suffix + '$'), '') + d.ext
    );
    try {
      fs.renameSync(file, newfile);
    } catch (error) {
      console.log(error);
    }
  });
};

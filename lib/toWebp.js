// 图片转webp格式
const path = require('path');
const fs = require('fs');
const glob = require('glob');
var webp = require('webp-converter');

function toWebp({ pattern = '**/*.{jpg,jpeg,png}', quality = 80 }) {
  let fileList = glob.sync(pattern, {
    ignore: '**/node_modules/**'
  });
  fileList.forEach((file) => {
    let d = path.parse(file);
    webp.cwebp(
      file,
      path.join(d.dir, `${d.name}.webp`),
      `-q ${quality}`,
      function(status, error) {
        if (error) {
          console.log(error);
        }
      }
    );
  });
}

module.exports = toWebp;

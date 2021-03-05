const fs = require('fs');
const glob = require('glob');

module.exports = ({ pattern, ratio = 100, originUnit, targetUnit }) => {
  console.log(`\n${ratio}${originUnit} => ${targetUnit}`);
  glob(
    pattern,
    {
      ignore: '**/node_modules/**'
    },
    (err, fileList) => {
      if (err) {
        console.log('fail');
      } else {
        console.log('\n处理: ', fileList);
        fileList.forEach((file) => {
          if (fs.statSync(file).isFile()) {
            unitTransform(file, ratio, originUnit, targetUnit);
          }
        });
      }
    }
  );
};

function unitTransform(file, ratio, originUnit, targetUnit) {
  let data = fs.readFileSync(file, 'utf-8');
  let exg = new RegExp(`\s(-?)([\w|\.]+)${originUnit}`, 'g');
  data = data.replace(exg, (a, b, c) => {
    let num = parseFloat(c) / ratio;
    let result;
    if (b) {
      result = ' -' + num + targetUnit;
    } else {
      result = ' ' + num + targetUnit;
    }
    console.log(`${a} => ${result}`);
    return result;
  });
  fs.writeFileSync(file, data, 'utf-8');
}

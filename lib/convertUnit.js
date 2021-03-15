const fs = require('fs');
const glob = require('glob');
const NP = require('number-precision');

module.exports = ({ pattern, ratio = 100, originUnit, targetUnit }) => {
  console.log(`\n1${originUnit} => ${ratio}${targetUnit}`);
  return new Promise((re, rj) => {
    glob(
      pattern,
      {
        ignore: '**/node_modules/**'
      },
      (err, fileList) => {
        if (err) {
          rj(err);
        } else {
          console.log('\n处理: ', fileList);
          fileList.forEach((file) => {
            if (fs.statSync(file).isFile()) {
              convertUnit(file, ratio, originUnit, targetUnit);
            }
          });
          re();
        }
      }
    );
  });
};

function convertUnit(file, ratio, originUnit, targetUnit) {
  let data = fs.readFileSync(file, 'utf-8');
  let exg = new RegExp(`\\s(-?)([\\w|\\.]+)${originUnit}`, 'g');
  data = data.replace(exg, (a, b, c) => {
    let num = NP.times(c, ratio);
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

const fs = require('fs');
const glob = require('glob');

module.exports = ({ pattern, ratio = 100 }) => {
  console.log(`\n1rem => ${ratio}px`);
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
            rem2px(file, ratio);
          }
        });
      }
    }
  );
};

function rem2px(file, ratio) {
  var data = fs.readFileSync(file, 'utf-8');
  data = data.replace(/\s(-?)([\w|\.]+)rem/g, (a, b, c) => {
    var num = parseFloat(c) * ratio,
      result;
    if (b) {
      result = ' -' + num + 'px';
    } else {
      result = ' ' + num + 'px';
    }
    console.log(`${a} => ${result}`);
    return result;
  });
  fs.writeFileSync(file, data, 'utf-8');
}

const fs = require('fs');
const glob = require('glob');

module.exports = ({ pattern, ratio = 100 }) => {
  console.log(`\n${ratio}px => 1rem`);
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
            px2rem(file, ratio);
          }
        });
      }
    }
  );
};

function px2rem(file, ratio) {
  var data = fs.readFileSync(file, 'utf-8');
  data = data.replace(/\s(-?)([\w|\.]+)px/g, (a, b, c) => {
    var num = parseFloat(c) / ratio,
      result;
    if (b) {
      result = ' -' + num + 'rem';
    } else {
      result = ' ' + num + 'rem';
    }
    console.log(`${a} => ${result}`);
    return result;
  });
  fs.writeFileSync(file, data, 'utf-8');
}

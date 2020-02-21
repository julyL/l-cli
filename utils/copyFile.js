const fs = require('fs-extra');

module.exports = (copyFile, copyToFile) => {
  if (fs.existsSync(copyToFile)) {
    console.log(`本地已存在，${copyToFile}将被重写`);
  }
  fs.writeFileSync(
    copyToFile,
    fs.readFileSync(copyFile, 'utf-8'),
    'utf-8'
  );
};

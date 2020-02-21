//  采用tinypng api 进行图片压缩
const fs = require('fs');
const path = require('path');
const https = require('https');
const glob = require('glob');
const pLimit = require('p-limit');
const limit = pLimit(2);

function getApiKey() {
  // TinyPng Api的key
  let keyList = [
    'PJ6935D5FKKxhhzTG9V9LsQKfw50znTl',
    'DGRwfhk6TyxTy9dBw6jMgBJnDM90LsY8'
  ];
  let index = Math.floor(Math.random() * 2);
  return keyList[index];
}

function logError(message) {
  console.error(message);
}

function tinyPng(input, output) {
  return new Promise((resolve, reject) => {
    const req_options = require('url').parse('https://api.tinypng.com/shrink');
    req_options.auth = `api:${getApiKey()}`;
    req_options.method = 'POST';
    const request = https.request(req_options, function(res) {
      let minRatio;
      res.on('data', function(d) {
        d = JSON.parse(d);
        if (d.error) {
          console.log(`${d.error}\n`);
          logError(`${d.error}: ${d.message}`);
          process.exit(1);
        } else {
          minRatio = `-${((1 - d.output.ratio) * 100).toFixed(1)}%`;
        }
      });
      if (res.statusCode === 201) {
        https.get(res.headers.location, function(res) {
          res.pipe(fs.createWriteStream(output));
          console.log(`${output} ${minRatio}`);
          resolve();
        });
      } else {
        console.log('reject', res.statusCode, input);
        reject();
      }
    });
    fs.createReadStream(input).pipe(request);
  });
}

module.exports = async function({
  pattern = '**/*.{jpg,jpeg,png}',
  suffix = '_tiny'
}) {
  let fileList = glob.sync(pattern, {
    ignore: '**/node_modules/**'
  });
  console.log('需要压缩的图片:', fileList);
  let proList = [];
  fileList.forEach((file) => {
    let d = path.parse(file);
    proList.push(
      limit(() => {
        return tinyPng(file, path.join(d.dir, d.name + suffix + d.ext));
      })
    );
  });
  try {
    await Promise.all(proList);
  } catch (error) {
    console.log(error);
  }
};

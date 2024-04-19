const fs = require('fs');
const path = require('path');
const glob = require('glob');
const askIf = require('../utils/askIf');
let fsExtra = require('fs-extra');

function getAllFolderNames(rawDir) {
  let folderList = fs
    .readdirSync(rawDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      return {
        name: dirent.name,
        path: path.join(rawDir, dirent.name)
      };
    });
  return folderList;
}

/**
 * 从指定文件夹中获取所有文本内容并返回合并后的字符串。
 * @param {string} scanFolder - 要扫描的文件夹路径。
 * @returns {Promise<string>} - 合并后的字符串。
 */
async function getScanAllFolderTextContent(scanFolder) {
  let fileList = glob.sync(scanFolder, {
    ignore: '**/{node_modules,miniprogram_npm,cli}/**'
  });
  // console.log(scanFolder);
  let proList = fileList.map((v) => {
    return new Promise((resolve, reject) => {
      fs.readFile(v, { encoding: 'utf-8' }, (e, data) => {
        if (e) {
          console.log(e);
          reject(e);
        } else {
          resolve(data);
        }
      });
    });
  });
  let list = await Promise.all(proList);
  let str = '';
  list.forEach((v) => {
    str += v;
  });
  return str;
}

async function remove({ componentFolder = '', scanFolder }) {
  // console.log('扫描文件夹', process.cwd(), componentFolder);
  let allComponentFolderNameList = getAllFolderNames(componentFolder);
  let content = await getScanAllFolderTextContent(scanFolder);
  // console.log('allComponentFolderNameList', allComponentFolderNameList);
  let unUseallComponentFolderNameList = allComponentFolderNameList.filter(
    (v) => {
      return content.indexOf('/' + v.name + '/') === -1;
    }
  );

  console.log(
    '\n\n未使用到的组件如下:\n',
    unUseallComponentFolderNameList.map((v) => v.name)
  );
  if (!unUseallComponentFolderNameList.length) {
    return;
  }

  let answer = await askIf({
    message: '是否删除未使用到的组件'
  });
  if (answer) {
    unUseallComponentFolderNameList.forEach((v) => {
      fsExtra.remove(v.path);
    });
    console.log('删除成功');
  }
}

module.exports = () => {
  remove({
    componentFolder: path.resolve(process.cwd(), './components/'),
    scanFolder: path.resolve(process.cwd(), './**/*.{json,js}')
  });
};

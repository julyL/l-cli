const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { getFileImageLinks, globIgnore } = require('../utils/index');

const currentDirectory = process.cwd();

function splitImageToFolder({ scanFolder }) {
  let globPath = scanFolder + '/**/*.{json,js,html,jsx,wxml,axml}';
  let fileList = glob.sync(globPath, {
    ignore: globIgnore
  });

  function checkAppJsonExist(scanFolder) {
    const appJsonPath = `${scanFolder}/app.json`;
    return fs.existsSync(appJsonPath);
  }

  if (!checkAppJsonExist(scanFolder)) {
    console.log(`${scanFolder}目录下，不存在小程序 app.json `);
    return;
  }

  let packageList = [];
  try {
    packageList = require(`${scanFolder}/app.json`).subPackages.map((r) =>
      r.root.replace('/', '')
    );
  } catch (error) {
    // 处理错误
  }
  if (!packageList.length) {
    return;
  }
  console.log('packageList', packageList);

  let imgDeps = {}; // 存储每个图片的使用文件
  fileList.forEach((file) => {
    let links = getFileImageLinks(file);
    links.forEach((link) => {
      if (!imgDeps[link]) {
        imgDeps[link] = [];
      }
      imgDeps[link].push(file);
    });
  });

  // 对imgDeps进行处理，每个图片都有一个依赖数组，依赖数组中存储了使用到该图片的文件路径。对所有文件路径进行分类，分类依据是必须currentDirectory的一级子文件夹。返回如下格式：
  // {
  //   'subFoldder1':['图片1', '图片2'],
  //   'subFoldder2':['图片1', '图片2'],
  // }
  const imageDependencies = {};
  Object.entries(imgDeps).forEach(([imageLink, files]) => {
    files.forEach((file) => {
      const relativePath = path.relative(currentDirectory, file);
      const subFolder = relativePath.split(path.sep)[0];
      if (!imageDependencies[subFolder]) {
        imageDependencies[subFolder] = [];
      }
      if (!imageDependencies[subFolder].includes(imageLink)) {
        imageDependencies[subFolder].push(imageLink);
      }
    });
  });

  function usedByOtherFolder({ imagePaths, folderName }) {
    const commonUseImageList = []; // 被多个文件夹使用的图片
    imagePaths.forEach((imagePath) => {
      return Object.entries(imageDependencies).some(([key, paths]) => {
        if (key !== folderName) {
          let r = paths.includes(imagePath);
          if (r) {
            commonUseImageList.push(imagePath);
          }
          return r;
        }
        return false;
      });
    });
    return imagePaths.filter(
      (imagePath) => !commonUseImageList.includes(imagePath)
    );
  }

  packageList.forEach((packageName) => {
    Object.entries(imageDependencies).forEach(([folderName, imagePaths]) => {
      if (folderName === packageName) {
        let unusedImages = usedByOtherFolder({ imagePaths, folderName });

        let filterFolder = `${scanFolder}/${packageName}`.replace(/\\/g, '/');
        unusedImages = unusedImages.filter(
          (imagePath) => !imagePath.startsWith(filterFolder)
        );
        console.log(`\n\n${packageName}文件夹独有的图片\n`, unusedImages);
      }
    });
  });
}

module.exports = () => {
  splitImageToFolder({ scanFolder: currentDirectory });
};

splitImageToFolder({ scanFolder: currentDirectory });

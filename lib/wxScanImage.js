const fs = require('fs');
const glob = require('glob');
const askIf = require('../utils/askIf');

const currentDirectory = process.cwd();
const {
  getFileImageLinks,
  getAllImagePaths,
  globIgnore
} = require('../utils/index');

/**
 * 获取扫描内容
 * @param {string} scanFolder - 扫描目录路径
 */
async function scanImage({ scanFolder, isRemove = true }) {
  let globPath = scanFolder + '/**/*.{json,js,html,jsx,wxml,axml}';
  let fileList = glob.sync(globPath, {
    ignore: globIgnore
  });

  // 所有使用到的图片资源
  let allUsedImageLinks = [];
  /*
    imgDeps = {
      '/images/1.png': ['a.js', 'b.wxml'],
      '/images/2.png': ['a.js']
    }
  */

  fileList.forEach((file) => {
    let links = getFileImageLinks(file);
    allUsedImageLinks = [...allUsedImageLinks, ...links];
  });

  allUsedImageLinks = allUsedImageLinks.filter(
    (link, index) => allUsedImageLinks.indexOf(link) === index
  );

  // fs.writeFileSync(
  //   path.resolve(__dirname, 'allUsedImageLinks.txt'),
  //   allUsedImageLinks.join('\n')
  // );

  // 检测到的所有图片资源
  let allImageLinks = getAllImagePaths(currentDirectory);

  let unusedImageLinks = allImageLinks.filter(
    (item) => !allUsedImageLinks.includes(item)
  );

  //  wxml中的动态图片链接如： /images/{{xxx}}.png
  let dynamicImageLinks = allUsedImageLinks.filter((item) =>
    item.includes('{{')
  );
  if (dynamicImageLinks.length && isRemove) {
    console.log('以下图片链接是动态的无法自动删除：', dynamicImageLinks);
    return;
    // throw new Error('动态图片链接：', dynamicImageLinks);
  }

  // 未使用的图片资源
  let missingImageLinks = allUsedImageLinks.filter(
    (link) => !allImageLinks.includes(link)
  );
  // console.log(imageDependencies);
  // fs.writeFileSync(
  //   path.resolve(currentDirectory, 'result.log'),
  //   '未使用到的图片:\n' +
  //     unusedImageLinks.join('\n') +
  //     '\n缺少的图片:\n' +
  //     missingImageLinks.join('\n'),
  //   { encoding: 'utf8' }
  // );

  console.log('\n未使用的图片链接:\n', unusedImageLinks);
  console.log('\n缺失的图片链接:\n', missingImageLinks);

  if (!unusedImageLinks.length) {
    return;
  }

  let answer = await askIf({
    message: '\n\n是否删除未使用的图片'
  });
  if (answer) {
    unusedImageLinks.forEach((item) => {
      fs.unlinkSync(item);
    });
    console.log('删除成功');
  }
}

module.exports = () => {
  scanImage({ scanFolder: currentDirectory });
};

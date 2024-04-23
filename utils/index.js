const fs = require('fs');
const path = require('path');
const glob = require('glob');

const globIgnore = '**/{node_modules,miniprogram_npm}/**';
const currentDirectory = process.cwd();

/**
 * 获取文件夹下所有文件名和文件路径
 * @param {string} rawDir - 文件夹路径
 * @returns {Array} - 包含文件名和文件路径的数组
 */
function getFolderAllFileName(rawDir) {
  // console.log('rawDir', rawDir);
  let fileList = glob.sync(rawDir, {
    ignore: globIgnore
  });
  let arr = [];
  fileList.forEach((file) => {
    let d = path.parse(file);
    arr.push({
      fileName: d.base,
      filePath: file
    });
  });
  return arr;
}

/**
 * 获取指定文件夹下所有图片文件的路径
 * @param {string} imageDir - 图片文件夹路径
 * @returns {Array} - 包含所有图片文件路径的数组
 */
function getAllImagePaths(imageDir) {
  let rawDir = path.resolve(__dirname, imageDir) + '/**/*.{png,jpg,jpeg,gif}';
  return getFolderAllFileName(rawDir).map((v) => v.filePath);
}

/**
 * 获取文件内容
 * @param {string} filePath - 文件路径
 * @returns {string|null} - 文件内容或null（如果读取文件出错）
 */
function getFileContent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('读取文件出错:', error);
    return null;
  }
}

/**
 * 提取图片链接
 * @param {string} filePath - 文件路径
 * @param {string} fileContent - 文件内容
 * @returns {Array} - 包含图片链接的数组
 */
function extractImageLinks({ filePath, fileContent }) {
  let arr = extractImageAbsoluteLinks(fileContent);
  const imageFullPathList1 = arr.map((imageLink) => {
    return path.join(currentDirectory, imageLink).replace(/\\/g, '/');
  });

  let arr2 = extractImageRelativeLinks(fileContent);
  const imageFullPathList = arr2.map((imageLink) => {
    return path.join(path.dirname(filePath), imageLink).replace(/\\/g, '/');
  });

  return [...imageFullPathList1, ...imageFullPathList];
}

/**
 * 提取相对路径的图片链接
 * @param {string} content - 文件内容
 * @returns {Array} - 包含相对路径图片链接的数组
 */
function extractImageRelativeLinks(content) {
  const regex = /['"]\.{1,2}\/[^'"]+\.(jpg|png|jpeg|gif)['"]/g;
  const matches = content.match(regex);
  if (matches) {
    const imageLinks = matches.map((match) => match.slice(1, -1));
    return imageLinks;
  } else {
    return [];
  }
}

/**
 * 提取绝对路径的图片链接
 * @param {string} content - 文件内容
 * @returns {Array} - 包含绝对路径图片链接的数组
 */
function extractImageAbsoluteLinks(content) {
  const regex = /['"]\/[^'"]+\.(jpg|png|jpeg|gif)['"]/g;
  const matches = content.match(regex);
  if (matches) {
    const imageLinks = matches.map((match) => match.slice(1, -1));
    return imageLinks;
  } else {
    return [];
  }
}

/**
 * 获取文件中的图片链接
 * @param {string} filePath - 文件路径
 * @returns {Array} - 包含文件中的图片链接的数组
 */
function getFileImageLinks(filePath) {
  const fileContent = getFileContent(filePath);
  if (fileContent) {
    const imageLinks = extractImageLinks({ filePath, fileContent });
    return imageLinks;
  } else {
    return [];
  }
}

module.exports = {
  globIgnore,
  getFolderAllFileName,
  getAllImagePaths,
  getFileContent,
  extractImageLinks,
  extractImageRelativeLinks,
  extractImageAbsoluteLinks,
  getFileImageLinks
};

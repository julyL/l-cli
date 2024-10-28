const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
// 从命令行获取应用名称和环境变量（默认为 'production'）
let app = process.argv[2];
let env = process.argv[3] || 'production';

let configPath;
let miniAppMapPath;
let miniAppMap;
let projectConfig;
let publishConfigPath;

/**
 * 发布指定小程序并更新相关配置文件
 * @param {Object} options - 发布选项
 * @param {string} options.app - 发布的小程序名称
 * @param {Function} [options.updateHook] - 可选更新回调函数，用于执行额外的配置更新
 * @param {string} [options.dirname] - 当前文件所在目录的绝对路径
 */
async function publish({ app, updateHook, dirname }) {
  // 检查小程序是否存在于 miniAppMap 中
  if (miniAppMap[app]) {
    // 输出发布信息
    console.log(
      `\n\n执行成功，当前环境：\n 小程序：【${miniAppMap[app].name}】  环境：${
        env === 'dev' ? '本地测试' : '线上'
      }`
    );

    // 设置小程序的环境变量
    miniAppMap[app].env = env;

    // 写入发布配置文件
    const data = 'module.exports = ' + JSON.stringify(miniAppMap[app], null, 2);

    try {
      fs.writeFileSync(publishConfigPath, data, 'utf-8');
    } catch (err) {
      console.error(`无法写入发布配置文件：${publishConfigPath}`);
      console.error(err.message);
      return;
    }

    // 更新项目配置文件中的 appid
    if (!fs.existsSync(configPath)) {
      console.error(`项目配置文件不存在：${configPath}`);
      return;
    }

    projectConfig.setting.appid = miniAppMap[app].wxAppId;
    projectConfig.appid = miniAppMap[app].wxAppId;

    try {
      fs.writeFileSync(
        configPath,
        JSON.stringify(projectConfig, null, 2),
        'utf-8'
      );
    } catch (err) {
      console.error(`无法写入项目配置文件：${configPath}`);
      console.error(err.message);
      return;
    }

    // 如果提供了更新钩子函数，则调用以执行额外的更新操作
    updateHook && updateHook();
  } else {
    // 若小程序不存在，则输出错误信息并返回状态 -1
    console.log(`app = ${app} 不存在`);
    return { app, status: -1 };
  }
}

/**
 * 启动发布流程
 * @param {Object} options - 发布流程选项
 * @param {Function} [options.updateHook] - 可选更新回调函数
 * @param {string} [options.dirname] - 当前文件所在目录的绝对路径
 */
function startPublishing({ updateHook, dirname }) {
  publishConfigPath = path.resolve(dirname, '../utils/publishConfig.js');
  configPath = path.resolve(dirname, '../project.config.json');
  miniAppMapPath = path.resolve(dirname, './miniAppMap.js');
  miniAppMap = require(miniAppMapPath);
  projectConfig = require(configPath);

  // 导入依赖模块

  // miniAppMap 文件路径检查
  if (!fs.existsSync(miniAppMapPath)) {
    console.error(`配置文件 miniAppMap.js 不存在：${miniAppMapPath}`);
    console.log(
      `${miniAppMapPath} 示例格式：\n${fs.readFileSync(
        path.resolve(__dirname, './example/miniAppMap.js')
      )}`
    );
    process.exit(1); // 退出程序
  }

  // 获取 miniAppMap 中的小程序选项列表
  const choices = Object.keys(miniAppMap).map((key) => ({
    name: `${miniAppMap[key].name} ${miniAppMap[key].app}`,
    value: miniAppMap[key].app
  }));

  // 如果指定为 'test' 应用，则直接发布
  if (app === 'test') {
    publish({ app, updateHook, dirname });
    return;
  }

  // 提示用户选择小程序并执行发布
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'appName',
        message: '请选择切换的小程序',
        choices
      }
    ])
    .then((answers) => {
      publish({ app: answers.appName, updateHook, dirname });
    });
}

// 导出 startPublishing 方法供外部使用
module.exports = {
  startPublishing
};

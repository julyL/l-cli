## l-cli

> 集成前端构建相关功能的 cli 工具，全局安装之后以 l-cli 命令执行

### 安装

```bash
# install
npm install @julylb/cli -g
```

### 功能介绍

```bash
# 查看使用帮助
l-cli -help

## 使用说明
Usage: l-cli <command> [options]

Options:
  -v, --version                     output the version number
  -h, --help                        output usage information

Commands:
  start                             修改package.json集成pre-commit钩子进行Eslint、prettier代码验证
  lint                              添加Eslint、Prettier代码检测
  mock <dir> [port]                 在指定端口启动mock服务，默认端口=8000
  tinypng [pattern] [suffix]        匹配图片进行压缩处理,默认添加后缀_tiny
  rmsuffix [pattern] [suffix]       去除tinypng产生的后缀,默认去除_tiny
  webp [pattern] [stuff] [quality]  将图片格式转换为webp
  rpx [pattern]                     将pattern匹配的文件中的px单位转换为rpx,1px=2rpx
  px2rpx [pattern]                  将pattern匹配的文件中的rpx单位转换为px,2rpx=1px
  unitTo [pattern]                  对文本中指定格式的单位进行转换,如：1rem=100px
  new [dir]                         新建样本文件
```

#### 添加pre-commit

```bash
$ l-cli start
```

修改当前执行路径下的package.json的内容文件添加pre-commit，来配合Eslint、Prettier进行代码检测。

添加合并配置如下：
```js
{
  'husky': {
    'hooks': {
      'pre-commit': 'lint-staged'
    }
  },
  'lint-staged': {
    '*.{js,vue,jsx,ts}': 'prettier --write *.{js,vue,jsx,ts} && eslint --fix'
  },
  'devDependencies': {
    'husky': '^3.0.0',
    'lint-staged': '^10.0.7'
  }
}
```

#### 添加Eslint、Prettier配置

在当前执行路径下的生成Eslint、Prettier的相关配置文件（可选择），Eslint配置采用了eslint-config-alloy的配置，支持4种项目类型：Javascript、Vue、React、Typescript

```bash
$ l-cli lint
```

[eslint-config-alloy项目地址](https://github.com/AlloyTeam/eslint-config-alloy)

#### mock服务

```bash
$ l-cli mock  [目录]  <端口默认8000>
```
在指定目录下的启动mock服务。进行接口 mock 时，只需要在指定目录下新建 json 文件。json文件内容对应接口返回内容,json文件名会按照一定规则转换为接口名, 转换规则为json文件名中的 `_` 替换为 `/`， 如： api_userinfo.json  =>  /api/userinfo

```bash
$ l-cli mock './test/mock' 8000
# 在test/mock目录下启动8000端口的mock服务 
# ./test/mock/hello_json =>  http://localhost:8000/hello/world
```

#### 图片压缩

使用TinyPng Api 进行图片压缩，压缩后的图片会添加`_tiny`的默认后缀

```bash
$ l-cli mock <glob匹配规则> [图片后缀]

$ l-cli tinypng '**/*.{jpg,png}'
# 使用tinypng Api进行图片压缩  1.png => 1_tiny.png
```

#### 去除后缀

去除压缩图片产生的默认后缀`_tiny`

```bash
$ l-cli rms <glob匹配规则> [图片后缀]

$ l-cli rms '**/*.{jpg,png}'
# 1_tiny.png => 1.png
```

#### 单位比例转换

扫描文件中的文本,对其中匹配的数字按比例进行转换
例如将css中的px转换为rem单位

```bash
$ l-cli unitTo '**/*.css'
```

#### 图片转webp格式

将图片格式转换为webp，默认压缩质量为80(max=100) 1.png => 1.webp

```bash
$ l-cli webp <glob匹配规则> [转换比例]

$ l-cli webp '**/*.png'
```

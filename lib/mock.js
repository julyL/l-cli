/**
 * 启动本地服务 localhost:8000 进行数据mock,
 * 如请求 http:localhost:8000/api/a/b 默认返回./mock目录下的api_a_b.json文件
 */
const fs = require('fs'),
  koa = require('koa'),
  cors = require('@koa/cors'),
  koaRouter = require('koa-router'),
  bodyParser = require('koa-bodyparser'),
  path = require('path'),
  ip = require('internal-ip');

module.exports = async function({ dir = './cli/mock', port = 8000 }) {
  var app = new koa(),
    router = new koaRouter(),
    localIP = await ip.v4();
  app.use(bodyParser());
  app.use(
    cors({
      'Access-Control-Allow-Origin': `http://${localIP}:${port}`,
      credentials: true
    })
  );

  async function handle(ctx, next) {
    let json = ctx.req.url
      .slice(1)
      .split('?')[0]
      .replace(/\//g, '_');
    if (/favicon\.ico/.test(json)) {
      ctx.body = 'ok';
      return;
    }
    let mock = json + '.json';
    if (!json) {
      ctx.body = 'mock server';
    } else {
      console.log('get:' + json);
      ctx.body = fs.readFileSync(
        path.resolve(process.cwd(), dir, mock),
        'utf-8'
      );
    }
  }

  // /api/a/b/c  =>  请求本地 api_a_b_c.json文件
  router.get('*', handle);
  router.post('*', handle);

  app.use(router.routes());

  app.on('error', (err) => {
    console.log('app.error:', err);
  });

  app.listen(port, () => {
    console.log(`mock server: http://localhost:${port}, mock in ${dir}`);
  });
};

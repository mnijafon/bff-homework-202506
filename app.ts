import { addAliases } from 'module-alias';
addAliases({
    '@root': __dirname,
    '@interfaces': `${__dirname}/interface`,
    '@config': `${__dirname}/config`,
    '@middlewares': `${__dirname}/middlewares`,
});
// 1. 导入 koa，创建 app 实例
import Koa from 'koa';
// 3. 引入 awilix，创建 awilix 容器
import { createContainer, Lifetime } from 'awilix';
import co from 'co';
// 5. 引入 koa-swig，注册视图模板引擎
import render from 'koa-swig';
console.log('准备导入 config...');
const config = require('./config/index.ts');
// 尝试不同的导入方式
// try {
// const config1 = require('./config/index.js');
// console.log('require("./config/index"):', config1);

// const config2 = require('./config/index.ts');
// console.log('require("./config/index.ts"):', config2);

// const config3 = require('./config');
// console.log('require("./config"):', config3);
// } catch (error) {
//     console.log('导入错误:', error.message);
// }

import serve from 'koa-static';
// 4. 引入 awilix-koa，注册路由
import { loadControllers, scopePerRequest } from 'awilix-koa';
//koa中没有实现的路由重定向到index.html
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import { configure, getLogger } from 'log4js';
import ErrorHandler from '@middlewares/ErrorHandler';
import * as process from "node:process";
//日志系统
configure({
    appenders: { cheese: { type: 'file', filename: `${__dirname}/logs/bff.log` } },
    categories: { default: { appenders: ['cheese'], level: 'error' } },
});
const app = new Koa();
console.log('config=====================================', config)
const { port, viewDir, memoryFlag, staticDir } = config;
// 静态资源生效节点
app.use(serve(staticDir));
// Lifetime.TRANSIENT 每次 resolve 都新建一个实例(不需要共享状态)
// Lifetime.SCOPED 每个作用域一个实例(每个请求一个独立实例（如 Web 请求）)
// Lifetime.SINGLETON 全局唯一实例(共享服务、数据库连接池等)
const container = createContainer();
// 3. 注册 services 目录下的所有服务到 awilix 容器
const isProduction = process.env.NODE_ENV === 'production';
// 生产环境编译成js文件，应扫描js文件，开发环境是ts文件
const fileExtensions = isProduction ? 'js' : 'ts';
//所有的可以被注入的代码都在container中
container.loadModules([`${__dirname}/services/*.${fileExtensions}`], {
    formatName: 'camelCase',
    resolverOptions: {
        lifetime: Lifetime.SCOPED,
    },
});
// 为每次http请求创建一个子容器，确保请求之间的数据隔离
// 子容器继承父容器的注册项，但拥有自己的scoped
// 请求处理过程中，所有的依赖解析都从这个子容器中进行
// 请求结束时，子容器会被销毁，释放资源
app.use(scopePerRequest(container));
app.context.render = co.wrap(
    render({
        root: viewDir,
        autoescape: true,
        cache: <'memory' | false>memoryFlag,
        writeBody: false,
        ext: 'html',
    })
);
// 添加前端路由重定向生效节点
// 除了白名单中的路由, 其他路由都重定向到 index.html
app.use(historyApiFallback({ index: '/', whiteList: ['/api'] }));
// 让所有的路由全部生效
const logger = getLogger('cheese');
ErrorHandler.error(app, logger);
// 自动发现和注册控制器
// 支持在控制器中使用依赖注入
// 通过装饰器（decorator）模式简化路由定义
app.use(loadControllers(`${__dirname}/routers/*.ts`));
// 2. 启动 web 服务
if (process.env.NODE_ENV === 'development') {
    app.listen(port, () => {
        console.log('BFF启动成功');
    });
}
export default app;

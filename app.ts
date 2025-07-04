// 1. 环境变量和基础配置（最先执行）
import * as process from 'node:process';
process.env.TZ = 'Asia/Shanghai'; // 设置时区

// 2. 模块别名配置（需在所有导入前设置）
import { addAliases } from 'module-alias';

addAliases({
    '@root': __dirname,
    '@interfaces': `${__dirname}/interfaces`,
    '@config': `${__dirname}/config`,
    '@middlewares': `${__dirname}/middlewares`,
});

// 3. 核心模块导入
import Koa from 'koa';
import { createContainer, Lifetime } from 'awilix';
import { loadControllers, scopePerRequest } from 'awilix-koa';
import serve from 'koa-static';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import render from 'koa-swig';
import co from 'co';
import { configure, getLogger } from 'log4js';
import ErrorHandler from '@middlewares/ErrorHandler';

// 4. 应用配置加载
const isProduction = process.env.NODE_ENV === 'production';
const config = require(`./config/index.${isProduction ? 'js' : 'ts'}`); // 注意：require 可避免 TS 转译冲突
const { port, viewDir, memoryFlag, staticDir } = config;

// 5. 日志系统初始化（尽早配置）
configure({
    appenders: {
        out: { type: 'stdout' },
        file: {
            type: 'dateFile',
            filename: `${__dirname}/logs/application.log`,
            pattern: 'yyyy-MM-dd',
            keepFileExt: true,
            numBackups: 7
        }
    },
    categories: {
        default: {
            appenders: ['out', 'file'],
            level: isProduction ? 'info' : 'debug'
        }
    }
});
const logger = getLogger('app');

// 6. 创建 Koa 应用实例
const app = new Koa();

// 7. 全局错误处理器（注册顺序要靠前）
ErrorHandler.error(app, logger);

// 8. 依赖注入容器配置
const container = createContainer();
container.loadModules([
    `${__dirname}/services/*.${isProduction ? 'js' : 'ts'}`
], {
    formatName: 'camelCase',
    resolverOptions: {
        lifetime: Lifetime.SCOPED,
    }
});
app.use(scopePerRequest(container));

// 9. 静态资源服务（如：assets 下的打包文件）
app.use(serve(staticDir, {
    maxage: isProduction ? 7 * 24 * 60 * 60 * 1000 : 0
}));
console.log('✅ 静态资源目录:', staticDir);

// 10. history API fallback - 仅处理 HTML 请求，交给后面的 ctx.render 渲染
app.use(historyApiFallback({
    whiteList: ['/api', '/assets', '/favicon.ico'],
    htmlAcceptHeaders: ['text/html']
}));

// 11. 如果是 HTML 路由请求（如 /user/profile），直接返回 SSR 的 index 页面
app.use(async (ctx, next) => {
    // 排除 API 请求（避免误判为 HTML）
    if (ctx.accepts('html') && !ctx.path.startsWith('/api')) {
        ctx.body = await ctx.render('index');
        return;
    }
    await next();
});

// 12. 注册模板引擎（Swig）
app.context.render = co.wrap(render({
    root: viewDir,
    autoescape: true,
    cache: memoryFlag as 'memory' | false,
    ext: 'html',
    // 生产环境优化配置
    ...(isProduction ? {
        cacheOptions: { max: 1000 },
        memoryCache: true
    } : {})
}));

// 13. 自动路由注册
app.use(loadControllers(`${__dirname}/routers/*.${isProduction ? 'js' : 'ts'}`, {
    cwd: __dirname
}));

// 14. 启动服务（避免在测试时自动启动）
if (!module.parent) {
    app.listen(port, () => {
        logger.info(`🚀 BFF 启动成功: http://localhost:${port}`);
        logger.info(`📁 静态资源目录: ${staticDir}`);
        logger.info(`🖥️ 视图模板目录: ${viewDir}`);
        logger.info(`⚙️ 当前环境: ${isProduction ? '生产环境' : '开发环境'}`);
    });
}

// 15. 导出 app 实例供测试用
export default app;

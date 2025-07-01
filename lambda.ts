import serverless from 'serverless-http';
import app from './app';
// 将 Koa 应用包装为 Lambda 处理函数
export const handler = serverless(app);

// exports.handler = async (event) => {
//   console.log(event);
//   return 'Hello from Lambda!';
// };

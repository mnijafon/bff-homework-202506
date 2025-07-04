// ecosystem.config.js - 免费套餐优化版
module.exports = {
  apps: [
    {
      name: 'bff-homework-202506',
      script: './app.js',
      instances: 1,           // 单实例，适配 1 vCPU
      exec_mode: 'fork',      // fork 模式，内存使用更少
      autorestart: true,
      watch: false,
      max_memory_restart: '800M', // 限制内存使用
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=512' // 限制 Node.js 内存
      },
      error_file: './logs/bff-error.log',
      out_file: './logs/bff-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
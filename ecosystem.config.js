module.exports = {
  apps: [
    {
      name: 'bff-homework-202506',
      script: './app.js',
      instances: 4, // 启动所有 CPU 核心
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/bff-error.log',
      out_file: './logs/bff-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};

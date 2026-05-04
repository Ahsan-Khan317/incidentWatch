module.exports = {
  apps: [
    // ==============================
    // BACKEND
    // ==============================
    {
      name: "backend",
      script: "/root/.bun/bin/bun",
      args: "src/server.js",
      cwd: "/opt/incidentWatch/apps/backend",
      interpreter: "none",

      // ✅ FIXED: Bun cluster mode support nahi karta
      // Bun apna khud ka multi-threading karta hai internally
      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",
        PORT: 8000,
      },

      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 3000,

      max_memory_restart: "350M",

      out_file: "/root/.pm2/logs/backend-out.log",
      error_file: "/root/.pm2/logs/backend-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },

    // ==============================
    // FRONTEND (Next.js)
    // ==============================
    {
      name: "frontend",
      script: "/root/.bun/bin/bun",
      args: "run start",
      cwd: "/opt/incidentWatch/apps/frontend",
      interpreter: "none",

      // ✅ Already correct
      instances: 1,
      exec_mode: "fork",

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      autorestart: true,
      watch: false,
      max_restarts: 5,
      min_uptime: "15s",
      restart_delay: 5000,

      max_memory_restart: "300M",

      out_file: "/root/.pm2/logs/frontend-out.log",
      error_file: "/root/.pm2/logs/frontend-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};

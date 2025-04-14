module.exports = {
  apps: [
    {
      name: "e-commerce-be",
      script: "./src/server.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: true,
      ignore_watch: ["node_modules", "uploads", ".git", "logs"],
    },
  ],
};

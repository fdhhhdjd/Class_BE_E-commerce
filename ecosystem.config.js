module.exports = {
  apps: [
    {
      name: "e-commerce-be",
      script: "node",
      args: "--watch --env-file=.env src/server.js",
      autorestart: true,
      watch: true,
      ignore_watch: ["node_modules", "uploads", ".git", "logs"],
    },
  ],
};

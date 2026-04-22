module.exports = {
  apps: [
    {
      name: "lingce-ai-chat",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
        PORT: 3002
      }
    }
  ]
};
const pgConfig = {
  Host: process.env.POSTGRES_HOST,
  Port: process.env.POSTGRES_PORT,
  User: process.env.POSTGRES_USER,
  Password: process.env.POSTGRES_PASSWORD,
  Database: process.env.POSTGRES_DB,
};

module.exports = pgConfig;

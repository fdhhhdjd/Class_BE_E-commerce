const { Pool } = require("pg");
const pgConfig = require("../configs/db.conf");

class PgDatabase {
  constructor() {
    this.pool = new Pool({
      user: pgConfig.User,
      host: pgConfig.Host,
      database: pgConfig.Database,
      password: pgConfig.Password,
      port: pgConfig.Port,
    });
  }

  async connect() {
    try {
      const client = await this.pool.connect();
      console.log("Connected to the PostgreSQL database 🐘");
      return client;
    } catch (err) {
      console.error("Error connecting to the PostgreSQL database", err);
      throw err;
    }
  }

  async query(query, values) {
    const client = await this.connect();
    try {
      const res = await client.query(query, values);
      return res;
    } catch (err) {
      console.error("Error executing query", err);
    } finally {
      client.release();
    }
  }
}

module.exports = new PgDatabase();

const dotenv = require("dotenv");
const path = require("path");

const { Client } = require("pg");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

const dbConfig = {
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
};

let client;

async function connectDB() {
  if (!client) {
    client = new Client(dbConfig);
    await client.connect();
  }

  return client;
}

module.exports = {
  connectDB,
};

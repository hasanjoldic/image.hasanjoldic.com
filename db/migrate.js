const path = require("path");
const { migrate: pgMigrate } = require("postgres-migrations");

const { connectDB } = require("./client");

async function migrate() {
  const client = await connectDB();
  try {
    await pgMigrate({ client }, path.resolve(__dirname, "./migrations"));
  } catch (error) {
    console.log("DB migration error", error);
  } finally {
    await client.end();
  }
}

migrate();

import { Sequelize } from "sequelize";
const { POSTGRES_PASS, POSTGRES_USER, POSTGRES_DB, DATABASE_URL } = process.env;

// export const sequelize = new Sequelize(`${POSTGRES_DB}`, `${POSTGRES_USER}`, `${POSTGRES_PASS}`, {
//   host: "localhost",
//   dialect: "postgres",
//   port: 5432,
//   logging: false,
// });

// `postgresql://postgres:${POSTGRES_PASS}@db.isdxyyyouhfxzpgvrxdg.supabase.co:5432/postgres`;

const connection_string = DATABASE_URL as string;

export const sequelize = new Sequelize(connection_string, {
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDB = async function () {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Supabase PostgreSQL successfully!");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

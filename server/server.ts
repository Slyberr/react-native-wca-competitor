import dotenv from "dotenv";
import express from "express";
import { createConnection } from "mysql2/promise";

const app = express();
dotenv.config();

// configure MariaDB
const dbConfig = {
  host: process.env.URL_MARIADB,
  user: process.env.LOGIN,
  password: process.env.MDP_USER,
  database: process.env.DB_NAME,
};

//Check if the user exist.
app.get("/persons/:input", async (req: any, res: any) => {
  try {
    const input: string = req?.params?.input;
    //Manage white spaces
    input.replace(/\s+/g, " ");
    const connection = await createConnection(dbConfig);
    const [rows] = await connection.query(
      "SELECT * FROM persons where  wca_id = ? OR name like ? ",
      [input, `%${input}%`],
    );
    await connection.end();
    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur started on :${PORT}`);
});

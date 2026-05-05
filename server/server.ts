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

//Find the user(s) by ID or name.
app.get("/", async (req: any, res: any) => {
  res.json({ res: "hi" });
});

//Find the user(s) by ID or name.
app.get("/person/:input", async (req: any, res: any) => {
  try {
    const input: string = req?.params?.input;
    //Manage white spaces
    input.replace(/\s+/g, " ");
    const connection = await createConnection(dbConfig);
    const [rows] = await connection.query(
      `SELECT * from persons p, geo_by_person gp 
	      WHERE p.wca_id = gp.wca_id
        AND (p.wca_id = ? OR  p.name like ?)`,
      [input, `%${input}%`],
    );
    await connection.end();

    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

//Get the best time + event for the user
app.get("/best/:ID/", async (req: any, res: any) => {
  try {
    const ID: string = req?.params?.ID;

    const connection = await createConnection(dbConfig);
    const [rows] = await connection.query(
      `SELECT event_id,best FROM ranks_single 
	      WHERE event_id NOT IN ('333mbf', '333fm')
	      AND person_id = ?
	      ORDER BY best 
	      LIMIT 1;`,
      [ID],
    );
    await connection.end();
    console.log(rows);
    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

//Get all nationals event rank for an competitior
//TODO : change cbe.single -> cbe.type
app.get("/ranks/national/:ID", async (req: any, res: any) => {
  try {
    const ID: string = req?.params?.ID;

    const connection = await createConnection(dbConfig);
    const [rows] = await connection.query(
      `(SELECT rs.person_id,rs.event_id, rs.country_rank, cbe.total as country_total,cbe.country_id,cbe.single from geo_by_person gp, count_by_event_country cbe,  ranks_single rs
WHERE rs.person_id = gp.wca_id
AND gp.wca_id = ?
AND cbe.type = 'single'
AND gp.country_id = cbe.country_id
AND cbe.event_id = rs.event_id)
UNION ALL
(SELECT ra.person_id,ra.event_id, ra.country_rank, cbe.total as country_total,cbe.country_id,cbe.single from geo_by_person gp, count_by_event_country cbe,  ranks_average ra
WHERE ra.person_id = gp.wca_id
AND gp.wca_id =  ?
AND cbe.type = 'average'
AND gp.country_id = cbe.country_id
AND cbe.event_id = ra.event_id);`,
      [ID, ID],
    );
    await connection.end();
    console.log(rows);
    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur started on :${PORT}`);
});

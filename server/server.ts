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
      `SELECT 
          * 
        FROM 
          wca_person_countries
        WHERE 
          (wca_id = ? 
          OR  name like ?)
        ORDER BY name`,
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
      `SELECT 
        event_id,
        best
      FROM 
        ranks_single 
	    WHERE 
        event_id NOT IN ('333mbf', '333fm')
	    AND 
        person_id = ?
	    ORDER BY best 
	    LIMIT 3;`,
      [ID],
    );
    await connection.end();
    console.log(rows);
    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

//Get competitior national ranks for all events.
app.get("/ranks/national/:ID", async (req: any, res: any) => {
  try {
    const ID: string = req?.params?.ID;

    const connection = await createConnection(dbConfig);
    const [rows] = await connection.query(
      `(SELECT 
        rs.person_id,
        rs.event_id,
        rs.country_rank,
        rs.best,
        pec.total AS total_country,
        pec.country_id,
        pec.type 
      FROM 
        wca_person_countries p,
        persons_event_country pec,
        ranks_single rs
      WHERE 
        rs.person_id = p.wca_id
      AND 
        p.wca_id = ?
      AND
         pec.type = 'single'
      AND 
        p.country_id = pec.country_id
      AND 
        pec.event_id = rs.event_id)
      UNION ALL
      (SELECT 
        ra.person_id,
        ra.event_id,
        ra.country_rank,
        ra.best,
        pec.total AS total_country,
        pec.country_id,
        pec.type 
      FROM 
          wca_person_countries p,
          persons_event_country pec,
          ranks_average ra
      WHERE 
        ra.person_id = p.wca_id
      AND 
        p.wca_id = ?
      AND 
        pec.type = 'average'
      AND 
        p.country_id = pec.country_id
      AND 
        pec.event_id = ra.event_id);`,
      [ID, ID],
    );
    await connection.end();
    console.log(rows);
    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


//Get competitior continental ranks for all events.
app.get("/ranks/continental/:ID", async (req: any, res: any) => {
  try {
    const ID: string = req?.params?.ID;

    const connection = await createConnection(dbConfig);
    const [rows] = await connection.query(
      `(SELECT 
 	      pec.event_id,
 	      sum(pec.total) AS total_continent,
 	      rs.person_id,
 	      pec.continent_id,
        rs.best,
 	      rs.continent_rank,
 	      pec.type
 	    FROM
	      wca_person_countries p,
 	      persons_event_country pec,
 	      ranks_single rs
      WHERE 
        p.wca_id = ?
      AND 
	      p.wca_id = rs.person_id
      AND
	      pec.continent_id = p.continent_id
      AND
	      pec.type = 'single'
      AND
	      pec.event_id = rs.event_id
      GROUP BY 
	      (pec.event_id))
	
      UNION ALL

      (SELECT 
 	      pec.event_id,
 	      sum(pec.total) AS total_continent,
 	      ra.person_id,
        pec.continent_id,
        ra.best,
 	      ra.continent_rank,
 	      pec.type
 	    FROM
	      wca_person_countries p,
 	      persons_event_country pec,
 	      ranks_average ra
 	    WHERE 
	      p.wca_id = ?
      AND 
	      p.wca_id = ra.person_id
      AND
	      pec.continent_id = p.continent_id
      AND
	      pec.type = 'average'
      AND
	      pec.event_id = ra.event_id
      GROUP BY 
	      (pec.event_id));`,
      [ID, ID],
    );
    await connection.end();
    console.log(rows);
    return res.json(rows);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

//Get  competitior world ranks for all events.
app.get("/ranks/world/:ID", async (req: any, res: any) => {
  try {
    const ID: string = req?.params?.ID;

    const connection = await createConnection(dbConfig);
    const [rows] = await connection.query(
      `(SELECT 
	      rs.person_id,
	      rs.world_rank,
        rs.best,
	      pec.event_id,
	      pec.type,
	      SUM(total) AS total_world
      FROM
	      persons_event_country pec,
	      ranks_single rs
      WHERE 
	      rs.person_id = ?
      AND 
	      rs.event_id = pec.event_id
      AND
	      pec.type = 'single'
      GROUP BY 
	      pec.event_id,
          pec.type
     	)
          
    UNION ALL 

    (SELECT 
	    ra.person_id,
	    ra.world_rank,
      	ra.best,
	    pec.event_id,
	    pec.type,
	    SUM(total) AS total_world
    FROM'2017PRES04'
	    persons_event_country pec,
	    ranks_average ra
    WHERE 
	    ra.person_id = ?
    AND 
	    ra.event_id = pec.event_id
    AND
	    pec.type = 'average'
    GROUP BY 
	    pec.event_id,
      	pec.type
    );`,
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


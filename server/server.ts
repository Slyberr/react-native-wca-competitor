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
          persons p,
          geo_by_person gp 
	      WHERE 
          p.wca_id = gp.wca_id
        AND 
          (p.wca_id = ? 
          OR  p.name like ?)
        ORDER BY p.name`,
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
        cbe.total AS total_country,
        cbe.country_id,cbe.type 
      FROM 
        geo_by_person gp,
        count_by_event_country cbe,
        ranks_single rs
      WHERE 
        rs.person_id = gp.wca_id
      AND 
        gp.wca_id = ?
      AND
         cbe.type = 'single'
      AND 
        gp.country_id = cbe.country_id
      AND 
        cbe.event_id = rs.event_id)
      UNION ALL
      (SELECT 
        ra.person_id,
        ra.event_id,
        ra.country_rank,
        ra.best,
        cbe.total AS total_country,
        cbe.country_id,
        cbe.type 
      FROM 
          geo_by_person gp,
          count_by_event_country cbe,
          ranks_average ra
      WHERE 
        ra.person_id = gp.wca_id
      AND 
        gp.wca_id =  ?
      AND 
        cbe.type = 'average'
      AND 
        gp.country_id = cbe.country_id
      AND 
        cbe.event_id = ra.event_id);`,
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
 	      cbe.event_id,
 	      sum(cbe.total) AS total_continent,
 	      rs.person_id,
 	      cbe.continent_id,
        rs.best,
 	      rs.continent_rank,
 	      cbe.type
 	    FROM
	      geo_by_person gp,
 	      count_by_event_country cbe,
 	      ranks_single rs
      WHERE 
        gp.wca_id = ?
      AND 
	      gp.wca_id = rs.person_id
      AND
	      cbe.continent_id = gp.continent_id
      AND
	      cbe.type = 'single'
      AND
	      cbe.event_id = rs.event_id
      GROUP BY 
	      (cbe.event_id))
	
      UNION ALL

      (SELECT 
 	      cbe.event_id,
 	      sum(cbe.total) AS total_continent,
 	      ra.person_id,
        cbe.continent_id,
        ra.best,
 	      ra.continent_rank,
 	      cbe.type
 	    FROM
	      geo_by_person gp,
 	      count_by_event_country cbe,
 	      ranks_average ra
 	    WHERE 
	      gp.wca_id = ?
      AND 
	      gp.wca_id = ra.person_id
      AND
	      cbe.continent_id = gp.continent_id
      AND
	      cbe.type = 'average'
      AND
	      cbe.event_id = ra.event_id
      GROUP BY 
	      (cbe.event_id));`,
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
	      cbe.event_id,
	      cbe.type,
	      SUM(total) AS total_world
      FROM
	      count_by_event_country cbe,
	      ranks_single rs
      WHERE 
	      rs.person_id = ?
      AND 
	      rs.event_id = cbe.event_id
      AND
	      cbe.type = 'single'
      GROUP BY 
	      cbe.event_id,
        cbe.type
      )
    UNION ALL 

    (SELECT 
	    ra.person_id,
	    ra.world_rank,
      ra.best,
	    cbe.event_id,
	    cbe.type,
	    SUM(total) AS total_world
    FROM
	    count_by_event_country cbe,
	    ranks_average ra
    WHERE 
	    ra.person_id = ?
    AND 
	    ra.event_id = cbe.event_id
    AND
	    cbe.type = 'average'
    GROUP BY 
	    cbe.event_id,
      cbe.type
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


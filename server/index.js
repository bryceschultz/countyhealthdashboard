const express = require("express");
const { Pool, Client } = require('pg')
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 3001;

const app = express()
app.use(cors())
const multer  = require('multer')
const upload = multer()

function getnewpool() {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })
  return pool
}


app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get("/query_aws_backend_fast_food", (req, res) => {
  pool.query('SELECT count(*) from fast_food', (err, res) => {
    console.log(err, res)
    pool.end()
  })
  res.json({ message: "Hello from server!" });
  
});

app.get("/query_aws_backend_mortality", (req, res) => {
  pool.query('SELECT count(*) from mortality', (err, res) => {
    console.log(err, res)
    pool.end()
  })
  res.json({ message: "Hello from server!" });
  
});

app.post("/death_count_all_counties", upload.none(), async (req, res) => {
  pool = getnewpool();
  const year = req.body.year;
  const response = await pool.query(`
  SELECT SUM(deaths) 
  FROM mortality 
  WHERE year = CAST(${year} AS int)`)
  pool.end();
  res.json(response);
});

app.post("/death_count", upload.none(), async (req, res) => {
  pool = getnewpool();
  const year = req.body.year;
  const fips = req.body.fips;
  const response = await pool.query(`
  SELECT SUM(deaths) 
  FROM mortality 
  WHERE year = CAST(${year} AS int)
  AND fips = CAST(${fips} AS varchar)
  `)
  pool.end();
  res.json(response);
});

app.get("/ff_count_all_counties", async (req, res) => {
  pool = getnewpool();
  const response = await pool.query('SELECT SUM(restuarants_2011) as sumRest2011, SUM(restuarants_2016) as sumRest2016 from fast_food')
  pool.end();
  res.json(response);
});

app.post("/ff_count", upload.none(), async (req, res) => {
  pool = getnewpool();
  const fips = req.body.fips;
  console.log(fips);
  const response = await pool.query(`
  SELECT 
    SUM(restuarants_2011) as sumRest2011, 
    SUM(restuarants_2016) as sumRest2016 
  FROM fast_food
  WHERE fips = CAST(${fips} AS varchar)
  `)
  pool.end();
  res.json(response);
});

app.post("/top_5", upload.none(), async (req, res) => {
  pool = getnewpool();
  const year = req.body.year;
  const fips = req.body.fips;
  const response = await pool.query(`
  SELECT cause_of_death, SUM(deaths) as death_counts
  FROM mortality
  WHERE year = CAST(${year} AS int)
  AND fips = CAST(${fips} AS varchar)
  GROUP BY cause_of_death
  ORDER BY death_counts DESC
  LIMIT 5`)
  pool.end()
  res.json(response);
});


app.get("/query_top_20_rows", (req, res) => {
  pool = getnewpool();
  pool.query(`
    SELECT * FROM mortality
    LIMIT 20`, (err, res) => {
    console.log(err, res)
    pool.end()
  })
  res.json({ message: "Hello from server!" });
  
});

app.post("/top_5_all_counties", upload.none(), async (req, res) => {
  pool = getnewpool();
  const year = req.body.year;
  const response = await pool.query(`
  SELECT cause_of_death, SUM(deaths) as death_counts
  FROM mortality
  WHERE year = CAST(${year} AS int)
  GROUP BY cause_of_death
  ORDER BY death_counts DESC
  LIMIT 5`)
  pool.end()
  res.json(response);
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
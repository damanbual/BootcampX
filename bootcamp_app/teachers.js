
const { Pool } = require("pg");

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "bootcampx",
});

const cohortName = process.argv[2];

const query = `
  SELECT DISTINCT teachers.name as teacher, cohorts.name as cohort
  FROM assistance_requests
  JOIN teachers ON teachers.id = assistance_requests.teacher_id
  JOIN students ON students.id = assistance_requests.student_id
  JOIN cohorts ON cohorts.id = students.cohort_id
  WHERE cohorts.name = $1
  ORDER BY teacher;
`;

const values = [cohortName];

pool
  .query(query, values)
  .then((res) => {
    if (res.rows.length === 0) {
      console.log("No results found.");
    } else {
      res.rows.forEach((row) => {
        console.log(`${row.cohort}: ${row.teacher}`);
      });
    }
  })
  .catch((err) => console.error("query error", err.stack))
  .finally(() => pool.end());

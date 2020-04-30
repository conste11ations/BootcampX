const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: 'redacted',
  host: 'localhost',
  database: 'bootcampx'
});

const extractUserValues = () => {
  const [, , cohort_name] = process.argv;
  return [cohort_name];
}

const values = extractUserValues();

pool.query(`
SELECT DISTINCT teachers.name as teacher, cohorts.name as cohort
FROM teachers
JOIN assistance_requests ON teacher_id = teachers.id
JOIN students ON student_id = students.id
JOIN cohorts ON cohort_id = cohorts.id
WHERE cohorts.name like concat('%', $1::text, '%')
ORDER BY teacher;
`, values)
.then(console.log('connected'))
.then(res => {
  res.rows.forEach(teacher => {
    console.log(`${teacher.cohort}: ${teacher.teacher}`);
  })
}).catch(err => console.error('query error', err.stack));

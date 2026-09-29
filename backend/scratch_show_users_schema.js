const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function query() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [ccRows] = await pool.query("SHOW CREATE TABLE content_calendar");
    console.log('SHOW CREATE TABLE content_calendar:\n', ccRows[0]['Create Table']);
    
    const [edRows] = await pool.query("SHOW CREATE TABLE event_days");
    console.log('\nSHOW CREATE TABLE event_days:\n', edRows[0]['Create Table']);

    const [bcRows] = await pool.query("SHOW CREATE TABLE blog_calendar");
    console.log('\nSHOW CREATE TABLE blog_calendar:\n', bcRows[0]['Create Table']);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

query();

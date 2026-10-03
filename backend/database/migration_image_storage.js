const pool = require('../config/db');

async function migrate() {
  const addColumnIfNotExists = async (table, column, definition) => {
    try {
      const [cols] = await pool.query(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [table, column]
      );
      if (cols.length === 0) {
        await pool.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
        console.log(`[OK] Added column \`${column}\` to table \`${table}\`.`);
      } else {
        console.log(`[INFO] Column \`${column}\` already exists on table \`${table}\`.`);
      }
    } catch (err) {
      console.error(`[ERROR] Failed to ensure column \`${column}\` on table \`${table}\`:`, err.message);
      throw err;
    }
  };

  try {
    console.log('--- Starting Image Storage Migration ---');
    await addColumnIfNotExists('clients', 'logo_url', 'VARCHAR(255) NULL DEFAULT NULL');
    await addColumnIfNotExists('users', 'profile_image', 'VARCHAR(255) NULL DEFAULT NULL');
    await addColumnIfNotExists('users', 'avatar_url', 'VARCHAR(255) NULL DEFAULT NULL');
    await addColumnIfNotExists('employees', 'avatar_url', 'VARCHAR(255) NULL DEFAULT NULL');
    
    // Also if profile_image on clients has values, copy to logo_url if logo_url is null
    try {
      await pool.query(`UPDATE clients SET logo_url = profile_image WHERE logo_url IS NULL AND profile_image IS NOT NULL AND profile_image != ''`);
    } catch (_) {}

    // If profile_image on employees has values, copy to avatar_url if avatar_url is null
    try {
      await pool.query(`UPDATE employees SET avatar_url = profile_image WHERE avatar_url IS NULL AND profile_image IS NOT NULL AND profile_image != ''`);
    } catch (_) {}

    console.log('--- Migration completed successfully ---');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();

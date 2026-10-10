/**
 * Simple Database Migration Runner for Node.js / MySQL
 * CommonJS format (.cjs) for 100% universal compatibility
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_NAME = process.env.DB_NAME || 'theme_marketplace';
const DB_USER = process.env.DB_USER || 'theme_user';
const DB_PASSWORD = process.env.DB_PASSWORD || 'theme_password_secure';

async function runMigrations() {
  console.log(`[Migration] Connecting to MySQL at ${DB_HOST}:${DB_PORT}, database: ${DB_NAME}...`);

  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      multipleStatements: true,
    });

    // 1. Ensure migrations table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`_migrations\` (
        \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL UNIQUE,
        \`applied_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Read executed migrations
    const [rows] = await connection.query('SELECT `name` FROM `_migrations`');
    const executedMigrations = new Set(rows.map(r => r.name));

    // 3. Find SQL files
    const migrationsDir = __dirname;
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`[Migration] Found ${files.length} migration file(s).`);

    for (const file of files) {
      if (executedMigrations.has(file)) {
        console.log(`[Migration] [SKIP] ${file} (already executed)`);
        continue;
      }

      console.log(`[Migration] [APPLYING] ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      await connection.query(sql);
      await connection.query('INSERT INTO `_migrations` (`name`) VALUES (?)', [file]);
      console.log(`[Migration] [DONE] ${file} successfully applied!`);
    }

    console.log('[Migration] All migrations are up to date!');
  } catch (err) {
    console.error('[Migration] Migration failed with error:', err);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigrations();

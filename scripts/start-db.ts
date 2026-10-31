import EmbeddedPostgres from 'embedded-postgres';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.resolve(process.cwd(), '.db-data');
const PORT = parseInt(process.env.DB_PORT || '5432', 10);
const USER = process.env.DB_USER || 'brightloop';
const PASSWORD = process.env.DB_PASSWORD || 'brightloop_secret';
const DBNAME = process.env.DB_NAME || 'brightloop_db';

console.log('====================================================');
console.log('🐘 BrightLoop Native Local PostgreSQL Server');
console.log('====================================================');
console.log(`Port:        ${PORT}`);
console.log(`User:        ${USER}`);
console.log(`Database:    ${DBNAME}`);
console.log(`Storage Dir: ${DB_DIR}`);
console.log('Mode:        Native Standalone (No Docker)');
console.log('====================================================');

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: DB_DIR,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: true,
  });

  const isInitialized = fs.existsSync(path.join(DB_DIR, 'PG_VERSION'));

  if (!isInitialized) {
    console.log('[Postgres] First time run: Initializing cluster data directory...');
    await pg.initialise();
    console.log('[Postgres] Cluster initialized successfully.');
  }

  console.log('[Postgres] Starting PostgreSQL server...');
  await pg.start();
  console.log(`[Postgres] Server listening on port ${PORT}.`);

  // Ensure database exists
  try {
    const client = pg.getPgClient();
    await client.connect();
    const checkRes = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DBNAME]
    );
    if (checkRes.rowCount === 0) {
      console.log(`[Postgres] Creating database "${DBNAME}"...`);
      await client.query(`CREATE DATABASE "${DBNAME}" OWNER "${USER}"`);
      console.log(`[Postgres] Database "${DBNAME}" created.`);
    } else {
      console.log(`[Postgres] Database "${DBNAME}" verified.`);
    }
    await client.end();
  } catch (err: any) {
    // If createDatabase via SQL fails because of permissions or already exists, fallback
    console.log(`[Postgres] Database check notice: ${err.message || err}`);
    try {
      await pg.createDatabase(DBNAME);
    } catch (_) {}
  }

  console.log(`\n✅ Ready! Connect via: postgresql://${USER}:${PASSWORD}@localhost:${PORT}/${DBNAME}\n`);
  console.log('Press Ctrl+C to stop PostgreSQL.');

  const shutdown = async () => {
    console.log('\n[Postgres] Stopping PostgreSQL server...');
    try {
      await pg.stop();
      console.log('[Postgres] Server stopped cleanly.');
    } catch (err: any) {
      console.error('[Postgres] Stop notice:', err.message || err);
    }
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Keep event loop alive
  setInterval(() => {}, 1000 * 60 * 60);
}

main().catch((err) => {
  console.error('[Postgres] Fatal error starting database:', err);
  process.exit(1);
});

import Database from 'bun:sqlite';

const db: Database = new Database(Bun.env.DB_FILE_PATH);

db.query(`CREATE TABLE IF NOT EXISTS "players" (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    game INTEGER NOT NULL 
  )`).run();

db.query(`CREATE TABLE IF NOT EXISTS "games" (
  id INTEGER NOT NULL,
  name TEXT NOT NULL,
  highscore INTEGER NOT NULL 
)`).run();
// db.query('CREATE UNIQUE INDEX IF NOT EXISTS user_id_IDX ON "user" (id)').run();

export default db;

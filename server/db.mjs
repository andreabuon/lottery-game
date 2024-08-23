/** DB access module **/
import sqlite3 from "sqlite3";

// Opening the database
const database_path = './';
const db = new sqlite3.Database(database_path+'database.db', (err) => {
    if (err) throw err;
});

export default db;

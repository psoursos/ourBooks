import sqlite3 from "sqlite3"
import { open } from "sqlite"

// this is a top-level await 

// const db = new sqlite3.Database('./myBooksDB.sqlite3')
// open the database
const db = await open({
    filename: "./model/db.sqlite",
    driver: sqlite3.Database
})


const sql = 'SELECT * FROM Users;'

// db.all(sql, [], (err, rows) => {
//     console.log(rows)
// })

const results = await db.all(sql, [])

console.log(results);

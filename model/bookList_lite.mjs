import sqlite3 from "sqlite3"
import { open } from "sqlite"

// const db = await open({
//     filename: "./model/db.sqlite",
//     driver: sqlite3.Database
// })
const db_name = "model/db.sqlite";

class BookList {
    myBooks = []

    constructor(username) {
        this.username = username;
    }

    async loadBooks() {
        try {
            //get the books of user
            this.db = await this.openDB()
            const sql = "SELECT title,author FROM Books JOIN BookUsers on Books.title = BookUsers.bookTitle WHERE userName = ? ORDER BY title; "
            this.myBooks = await this.db.all(sql,[this.username])
            console.log('load..',this.myBooks)
            this.db.close()
        } catch {
            this.db.close()
            console.log(error)
            throw error
        }
    }

    async addBook(newBook) {
        //Το βιβλίο προστίθεται στον πίνακα Books αν δεν υπάρχει,
        //προστίθεται επίσης νέα εγγραφή στον πίνακα BookUsers
        try {
            await this.addUser(this.username); //προστίθεται ο χρήστης αν δεν είναι ήδη στον πίνακα Users 
            this.db = await this.openDB()
            const sql1 = "INSERT OR IGNORE INTO Books(title,author) VALUES (?,?);";
            await this.db.run(sql1, [newBook.title, newBook.author]);
            await this.db.close()
        } catch (error) {
            this.db.close()
            console.log(error)
            throw error
        }
        try {
            this.db = await this.openDB()
            const sql2 = "INSERT OR IGNORE INTO BookUsers VALUES (?,?,NULL);";
            await this.db.run(sql2, [newBook.title, this.username]);
            await this.db.close()
        } catch (error) {
            this.db.close()
            console.log(error)
            throw error
        }
    }
    
    async deleteBook(book) {
        // Το βιβλίο διαγράφεται από τον πίνακα BookUsers
        // αν δεν υπάρχει άλλος χρήστης για το βιβλίο διαγράφεται και από τον πίνακα Books
        try {
            this.db = await this.openDB()
            console.log('to delete ..', book)
            const sql1 = "DELETE FROM BookUsers WHERE bookTitle=? and userName=?";
            await this.db.run(sql1, [book.title, this.username]);
            await this.db.close()
        } catch (error) {
            console.log(error)
            throw error
        }
        try {
            this.db =await this.openDB()
            const sql2 ="SELECT * FROM BookUsers WHERE bookTitle = ?;"
            const rows = await this.db.all(sql2, [book.title])
            if (rows.length ===0){
                const sql3 = "DELETE FROM Books WHERE title =?;"
                await this.db.run(sql3,[book.title])
            }
            await this.db.close()
        }catch (error){
            this.db.close()
            console.log(error)
            throw error
        }
    }


    async addUser(username) {
        try {
            this.db = await this.openDB()
            const sql1 = "INSERT OR IGNORE INTO Users VALUES (?,NULL);";
            await this.db.run(sql1, [username]);
            await this.db.close()

        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async openDB() {
        return await open({filename: db_name, driver: sqlite3.Database})
    }
}

//export { BookList }
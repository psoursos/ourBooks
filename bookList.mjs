import fs from 'fs/promises'

const fileName = "myBooks.json"

let newBooks = { 
    title:"Το Θεμέλιο" ,
    author:" Άρθουρ Κ. Κλαρκ" 
}

class BookList {
    myBooks = { books: [] }


    async loadBooksFromFile() {

        try {
            const data = await fs.readFile(fileName, "utf-8")
            this.myBooks = JSON.parse(data)
        } catch (error) {
            throw error
        }
    }

     async addBookToFile(newBook) {
        await this.loadBooksFromFile()
        if (!this.isBookInList(newBook)) {

            this.myBooks.books.push(newBook)
            let jsonObj = JSON.stringify(this.myBooks)
            try {
                 await fs.writeFile(fileName, jsonObj,{flag: "w+"})
            } catch (error) {
                throw error
            }
        } else {
            console.log("Book already in file!")
        }

    }

    isBookInList(book) {
        let bookFound = this.myBooks.books.find(item => (
            item.title === book.title &&
            item.author === book.author
            ));
            return bookFound
    }
    
    }
// create module
    export { BookList }


// const bookList = new BookList()
// //await bookList.loadBooksFromFile()
// //await bookList.addBookToFile(newBook)
// //await bookList.loadBooksFromFile()
// //bookList.addBookToFile({ title: 'Σολάρις', author: 'Στάνισλαβ Λεμ' })
// //bookList.addBookToFile({ title: 'Ο γύρος του κόσμου σε 80 μέρες', author: 'Ιούλιος Βερν' })
// //bookList.addBookToFile({ title: 'Σολάριςc', author: 'Στάνισλαβ Λεμoo' })
// await bookList.addBookToFile({ title: 'Σολάρι1s', author: 'Στάνισλαβ Λεμ1as' })
// await bookList.loadBooksFromFile()

// console.log(bookList.myBooks)
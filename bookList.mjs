import fs from 'fs/promises'

    class BookList {
        myBooks = { books: [] }
        
        constructor(username) {
            if (username==undefined)
                throw new Error("No username")
            this.fileName = "myBooks_"+ username +".json"
        }


    async loadBooksFromFile() {

        try {
            //throw new Error("Test Error")
            const data = await fs.readFile(this.fileName,{ flag: "a+", encoding: "utf-8"})
            if(data!='')
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
                 await fs.writeFile(this.fileName, jsonObj,{flag: "w+"})
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
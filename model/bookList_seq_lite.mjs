import { Sequelize,DataTypes } from 'sequelize';
const db_name = "model/books2.sqlite";

const sequelize = new Sequelize({
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    define: {
        timestamps: false
    },
    // SQLite only
    storage: db_name
});

//Ορισμός Μοντέλου
const Book = sequelize.define('Book',{
    title:{
        type:DataTypes.TEXT,
        primaryKey: true,
        unique: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: false
    },
});

const User = sequelize.define('User',{
    name:{
        type:DataTypes.TEXT,
        primaryKey: true
    },
    password: {
        type: DataTypes.TEXT
    },
});

const BookUser = sequelize.define('BookUser',{

    comment : {
        type: DataTypes.TEXT
    },
});

Book.belongsToMany(User, {through: BookUser})
User.belongsToMany(Book, {through: BookUser})

await sequelize.sync({ alter:true});// recreate all tables in the db if they do not



class BookList {
    myBooks = []

    constructor(username) {
        if (username == undefined)
            throw new Error("Δεν έχει οριστεί ο χρήστης")
        this.username = username;
    }

    async loadBooks() {
        try {
            //get the books of user
            await this.findOrAddUser();//add user if not already exists
            this.myBooks = await this.user.getBooks({raw:true})
        } catch (error){
            throw error
        }
    }

    async addBook(newBook) {
        //Το βιβλίο προστίθεται στον πίνακα Books αν δεν υπάρχει,
        //προστίθεται επίσης νέα εγγραφή στον πίνακα BookUsers
        try {
            await this.findOrAddUser(); //προστίθεται ο χρήστης αν δεν είναι ήδη στον πίνακα Users 
            let book = await Book.findOne({where:{title:newBook.title}}) 
            console.log(book)
            if (!book){
                book = await Book.create({
                    title: newBook.title,
                    author: newBook.author
                })
            }
            await this.user.addBook(book)
        } catch (error) {
            throw new Error(error.errors[0].message)
        }
    }
    
    async deleteBook(book) {
        // Το βιβλίο διαγράφεται από τον πίνακα BookUsers
        // αν δεν υπάρχει άλλος χρήστης για το βιβλίο διαγράφεται και από τον πίνακα Books
        try {
            await this.findOrAddUser()
            const bookToRemove = await Book.findOne(
                { where: {title: book.title } }
            )
            await bookToRemove.removeUser(this.user)
            //this.user.removeBook(bookToRemove) //εναλλακτικά, από την πλευρά του User

            //Aν δεν υπάρχουν άλλοι χρήστες, διαγράφουμε το βιβλίο
            const numberOfUsers = await bookToRemove.countUsers()
            if (numberOfUsers == 0) {
                Book.destroy(
                    { where: {title: book.title } }
                )
            }
        } catch (error) {
            throw error
        }
    }

    async findOrAddUser() {
        //στο this.user θα φυλάσσεται το αντικείμενο που αντιπροσωπεύει τον χρήστη στη sequelize
        //αν δεν υπάρχει, τότε το ανακτούμε από τη sequelize
        //αλλιως, υπάρχει το this.user και δεν χρειάζεται να κάνουμε κάτι άλλο
        if (this.user == undefined) {
            try {
                console.log(this.username)
                const [user,created]= await User.findOrCreate({where: {name: this.username}})
                this.user = user
            } catch (error) {
                throw error
            }   
        }
        
    }

}

export { BookList }

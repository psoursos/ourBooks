import { Sequelize, DataTypes } from 'sequelize';
const db_name = "model/books3.sqlite";

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
        primaryKey: true, 
    },
    password: {
        type: DataTypes.TEXT
    },
});

const BookUser = sequelize.define('BookUser',{

    comment : {
        type: DataTypes.TEXT
    }
});

Book.belongsToMany(User, {through: BookUser})
User.belongsToMany(Book, {through: BookUser})

await sequelize.sync({ alter:true});

const [user, user_result]= await User.findOrCreate(
    { where: {name: "Νίκος"}
});
console.log(user,"user_result:", user_result)

const [book, book_created]= await Book.findOrCreate(
    { where: {
        title: "Δον Κιχώτε",
        author:"Μ. Ντε Θερβάντες"
    }
});
console.log(book,"created=", book_created)

   import {Book,User,BookUser,Op} from './bookList_seq_postgres.mjs'
   import bcrypt from 'bcrypt'
   
   

   async function addUser(username,password) {
    try{
        if (!username || !password) 
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")

        let user = await User.findOne({where: {name: username}})

        if (user)
            throw new Error("Υπάρχει ήδη χρήστης με όνομα "+ username)

    
        const hash = await bcrypt.hash(password,10)
        user = await User.create({name: username, password:hash})
        return user
    } catch (error) {
        throw error
    }
   }

   async function login(username,password) {

    try{
        if (!username || !password) 
            throw new Error("Λείπει το όνομα ή το συνθηματικό του χρήστη")

        let user = await User.findOne({where: {name: username}})

        if (!user)
            throw new Error("Δεν υπάρχει χρήστης με όνομα " + username)

    
        const match = await bcrypt.compare(password,user.password)
        if (match) {
            return user
        } else {
            throw new Error("Λάθος στοιχεία πρόσβασης")
        }
    } catch (error) {
        throw error
    }
   }
   
   async function loadBooks(username) {
        try {
            if (!username)
                throw new Error("Πρέπει να δοθεί όνομα χρήστη")

            const user = await User.findOne({where: {name: username} });//add user if not already exists  
            if(!user)
            throw new Error("Άγνωστος χρήστης")

            //get the books of user
            const myBooks = await user.getBooks({ raw : true });//raw: no metadata
            return myBooks

        } catch (error){
            throw error
        }
    }

    async function addBook(newBook,username) {
        //Το βιβλίο προστίθεται στον πίνακα Books αν δεν υπάρχει,
        //προστίθεται επίσης νέα εγγραφή στον πίνακα BookUsers
        try {
            if (!username)
                throw new Error("Πρεπει να δοθεί όνομα χρήστη")

                const user = await User.findOne({where: {name: username} });//add user if not already exists  
                if(!user)
                    throw new Error("Άγνωστος χρήστης")

          // await this.findOrAddUser(); //προστίθεται ο χρήστης αν δεν είναι ήδη στον πίνακα Users 
            const [book, created] = await Book.findOrCreate({
                where: {
                    title: newBook.title,
                    author: newBook.author 
                }
            }) 
            //console.log(book)
            // if (!book){
            //     book = await Book.create({
            //         title: newBook.title,
            //         author: newBook.author
            //     })
            // }
            await user.addBook(book)
        } catch (error) {
            throw error
        }
    }
    // το βιβλίο διαγράφεται από τον πίνακα "BookUser" 
    //,username
    async function deleteBook(book,name) {
        // Το βιβλίο διαγράφεται από τον πίνακα BookUsers
        // αν δεν υπάρχει άλλος χρήστης για το βιβλίο διαγράφεται και από τον πίνακα Books
        try {
            //await this.findOrAddUser()
            //const user= await User.findOne({where: {name: username}}) ;
            const bookToRemove = await Book.findOne(
                { where: {title: book.title } }
            )
            const usernameToRemove = await User.findOne(
                { where: {name: name.name } }
            )
            await bookToRemove.removeUser(usernameToRemove)//this.user
           // User.removeAttribute(bookToRemove) //εναλλακτικά, από την πλευρά του User
        //    BookUser.destroy({
        //     where: {booktitle: book.title ,username: name}} 
        // );
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

    async function loadComments(title,username) {
        try {
            if (!title)
                throw new Error("Δεν υπάρχει το συγκεκριμένο βιβλίο.")
                ///   ,$and : {UserName: username.username }
            const comments = await BookUser.findAll({
                where: {
                    BookTitle: title.title, 
                    UserName: {
                        [Op.notIn]:[username.username]
                    } 
                },
                raw: true,
            });
         
            if(!comments)
            throw new Error("Δεν υπάρχει το συγκεκριμένο βιβλίο.")

            //get the books of user
           // const myBooks = await user.getBooks({ raw : true });//raw: no metadata
            return comments

        } catch (error){
            throw error
        }
    }

    async function loadComment(title,username) {
        try {
            if (!title)
                throw new Error("Δεν υπάρχει το συγκεκριμένο βιβλίο.")

            const comment = await BookUser.findOne({
                where: {
                    BookTitle: title.title,
                    UserName: username.username 
                },
                raw: true, 
            });//add user if not already exists  
            if(!comment)
            throw new Error("Δεν υπάρχει το συγκεκριμένο βιβλίο.")

            //get the books of user
           // const myBooks = await user.getBooks({ raw : true });//raw: no metadata
            return comment

        } catch (error){
            throw error
        }
    }

    async function getBook(title) {
        try {
            if (!title)
                throw new Error("Πρέπει να δοθεί τίτλος")

            const theBook = await Book.findOne({
                where: {
                    title: title.title
                },
                raw:true ,
            
            });//add user if not already exists  
            if(!theBook)
            throw new Error("Άγνωστο βιβλίο")

            //get the books of user
            //const myBooks = await user.getBooks({ raw : true });//raw: no metadata
            return theBook

        } catch (error){
            throw error
        }
    }

    async function addComment(data,username) {
        try {
            if (!data)
                throw new Error("no data ")

                const user = await User.findOne({where: {name: username} });//add user if not already exists  
                if(!user)
                    throw new Error("Άγνωστος χρήστης")

          // await this.findOrAddUser(); //προστίθεται ο χρήστης αν δεν είναι ήδη στον πίνακα Users 
            const [bookUser, created] = await BookUser.update(
                {
                    comment: data.comment,
                },
                {
                    where: {
                        BookTitle: data.title,
                        UserName: user.name,
                            }
            }) 
            return bookUser
        } catch (error) {
            throw error
        }

    }

    async function findOrAddUser() {
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
    export { addUser ,login, loadBooks, addBook,deleteBook,findOrAddUser,loadComments,loadComment,getBook,addComment}
import express from 'express'
//import { ValidatorsImpl } from 'express-validator/src/chain/validators-impl.js';
//use different models to demonstrate connection to different databases
//import { BookList } from './bookList.mjs'
//import { BookList } from './model/bookList_seq_lite.mjs'
//import { BookList } from './model/bookList_seq_postgres.mjs'
import  * as Validator from './validator/validation.mjs'
import  * as BookList  from './model/bookList_model.mjs'
import  * as UserController  from './controller/user_controller.mjs'
import  * as BookController  from './controller/book_controller.mjs'


const router2 = express.Router()

router2.get("/", (req,res) => {
    if(req.session.username) {
        res.redirect("/books")
    } 
    else {
        res.render("home")
    }
})

router2.get("/books",
UserController.checkIfAuthenticated,
BookController.showBookList
)

// router2.post("/books", async(req,res,next) => {
//     req.session.username = req.body["username"]
//     console.log(req.body["username"])
//     next()
// },
// showBookList
// )

 router2.post("/books",
  //  UserController.checkIfAuthenticated,
    Validator.validateLogin,
    UserController.doLogin,
    BookController.showBookList )
    
router2.get("/addbookform",
    UserController.checkIfAuthenticated,
    async(req,res) => {
        res.render("addbookform")
    })
    
    
    
    router2.post('/doAddbookform',
        UserController.checkIfAuthenticated,
        Validator.validateNewBook,
        BookController.addBook,
        BookController.showBookList)
    
    // router2.get("/about",async(req,res,next) => {
    //     console.log("About this application")
    //     res.send("About this application")
    // })
/////////////////////////////////////////////////////////////    
///todo
 router2.get("/delete/:title",
    UserController.checkIfAuthenticated,
    BookController.deleteBook,
    BookController.showBookList)

    router2.get("/logout",
    UserController.checkIfAuthenticated,// delete ?
    UserController.doLogout,
    (req,res) => {
        res.redirect("/")
    })

    router2.get("/register",
    //UserController.checkIfAuthenticated,
    async(req,res) => {
        res.render("registrationform")
    })

    router2.post("/doregister",
    Validator.validateNewUser,
    UserController.doRegister
    )

    router2.get("/comment/:title",
    UserController.checkIfAuthenticated,
    BookController.showBookComments,
    )

    router2.post("/comment/:title",
    UserController.checkIfAuthenticated,
    BookController.updateComment,
    BookController.showBookComments,
    )
        
    export {router2}
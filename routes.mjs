import express from 'express'
import { ValidatorsImpl } from 'express-validator/src/chain/validators-impl.js';
import { BookList } from './bookList.mjs'
import {body,validationResult} from 'express-validator'

const router2 = express.Router()
const bookList = new BookList;

router2.get("/books",async(req,res) => {
    await bookList.loadBooksFromFile()
    res.render("booklist",{books: bookList.myBooks.books} )
    }) 
    
router2.get("/addbookform",async(req,res) => {
    res.render("addbookform")
    })


    
router2.post('/doAddbookform',
//added validation :npm i express-validator 
body("newBookTitle")
.isAlpha('el-GR',{ignore:' '}).trim().escape()
.withMessage("Must be in greek!")
.isLength({min:5})
.withMessage("Length > 4"),

async(req,res) => {
    const errors = validationResult(req)

    if(errors.isEmpty()){
        const newBook = {
            "title":  req.body["newBookTitle"], 
            "author": req.body["newBookAuthor"] 
        }
        await bookList.addBookToFile(newBook)
        //redirect
        res.redirect("/books")
    } else {
        res.render("addbookform", {
            message: errors.mapped(),
            //send to addBookForm bootstrap 
            title:req.body["newBookTitle"],
            author:req.body["newBookAuthor"]
        })
    }
})

router2.get("/about",(req,res) => {
    console.log("About this application")
    res.send("About this application")
    })

    export {router2}
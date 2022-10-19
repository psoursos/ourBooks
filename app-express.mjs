import express from 'express'
import {engine} from "express-handlebars";



//import { BookList } from './bookList.mjs'
import { router } from './my-router.mjs';
import { router2 } from './routes.mjs' ;

const app = express()

app.engine(`.hbs`,engine({ extname: `.hbs` }));
app.set(`view engine`,`.hbs`);

//folder for static resources
app.use(express.static("public"))


//const bookList = new BookList;

//middleware provided by express  to access request body
app.use(express.urlencoded({extended:false}))



    ///  /random and /about hang after /book
    app.use("/book",router)
    app.use("/",router2)
// 
// 
// 

// /book?title=llaa
app.get("/book",async(req,res) => {
    console.log("Searching for book title : ",req.query)
    res.send("Search results for book title : " +req.query["title"])
    
})

    //or named parameters
app.get("/book/:title/:author",async(req,res) => {
    console.log("using req.parms")
    console.log("Searching for book title : ",req.params)
    res.send("Search results for book title : "+req.params["title"])
})

app.post("/book",(req,res) => {

    console.log("Post Request : ", req.body)
    res.send("Search results for book title : "+req.body["title"])

})

// app.use((req,res) => {
//      //redirect
//     // res.writeHead(303,{ location: "/books"})
//     res.redirect("/books")
// })

app.listen(3001, ()=> console.log("app is running!"))

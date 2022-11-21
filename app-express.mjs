// validation v.3.1.7 Diaxeirhsh Synedrias
import 'dotenv/config'
import express from 'express'
import {engine} from 'express-handlebars'

import session from 'express-session'
import createMemoryStore from 'memorystore'


//import { BookList } from './bookList.mjs'
//import { router } from './my-router.mjs';
import { router2 } from './routes.mjs' ;

const app = express()

const MemoryStore = createMemoryStore(session)

const myBooksSession = session ({
    //crypto  check if client S_Id is ok
    secret : process.env.SESSION_SECRET,
    //detete mem store after 24 hours
    store: new MemoryStore({checkPeriod: 86400*1000}),
    resave: false,
    saveUninitialized:false,
    name: "myBooks-sid" ,// connect.sid
    cookie: {
        maxAge: 1000*60*20 // 20 min lifespan if not renewed
    }

})
//use session
app.use(myBooksSession)


//folder for static resources
app.use(express.static("public"))
//handlebars
app.engine(`.hbs`,engine({ extname: `.hbs` }));
app.set(`view engine`,`.hbs`);
//middleware provided by express  to access request body
app.use(express.urlencoded({extended:false}))
///  /random and /about hang after /book
//app.use("/book",router)
app.use("/",router2)
// 
// /book?title=llaa
// app.get("/book",async(req,res) => {
//     console.log("Searching for book title : ",req.query)
//     res.send("Search results for book title : " +req.query["title"])
    
// })

//     //or named parameters
// app.get("/book/:title/:author",async(req,res) => {
//     console.log("using req.parms")
//     console.log("Searching for book title : ",req.params)
//     res.send("Search results for book title : "+req.params["title"])
// })

// app.post("/book",(req,res) => {
//     console.log("Post Request : ", req.body)
//     res.send("Search results for book title : "+req.body["title"])
// })

// app.use((req,res) => {
//      //redirect
//     // res.writeHead(303,{ location: "/books"})
//     res.redirect("/books")
// })

app.use((err,req,res,next) => {
    console.log(err.stack)
    res.render("error",{message: err.message})
})

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> console.log("app is running! port : "+PORT))

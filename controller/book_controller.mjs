import  * as BookList  from '../model/bookList_model.mjs'

async function showBookList (req,res,next) {
    //req.session.hitCounter++
    // or , username: req.session.username
    try {
        //res.locals.username = req.session.username 
        //const bookList = new BookList(req.session.username);
       // await bookList.loadBooksFromFile()
       const myBooks = await BookList.loadBooks(req.session.username)
       console.log(myBooks)
        res.render("booklist",{books: myBooks} )
    } catch (error) {
        next(error)
    }
}

const addBook = async(req,res, next) => {

    try {
        await BookList.addBook({
            "title":  req.body["newBookTitle"], 
            "author": req.body["newBookAuthor"] 
        }, req.session.username)
        next()
    } catch (error) {
        next(error) //call middleware 
    }
}

const deleteBook = async(req,res, next) => {
    const title = req.params.title;
    const username = req.session.username;
    try {
        //const bookList = new BookList(req.session.username)
        await BookList.deleteBook({ title : title },{name : username})
        next()
    } 
    catch (error) {
        next(error) //call middleware 
    }
}

const showBookComments = async(req,res, next) => {
    const title = req.params.title;
    const username = req.session.username;
    try {
        //const bookList = new BookList(req.session.username)
        const myComment = await BookList.loadComment({ title : title }, {username : username})
        const allComments = await BookList.loadComments({ title : title }, {username : username})
        const theBook = await BookList.getBook({title : title})
        
      console.log("////////////  1  ////////////////")
      console.log(allComments)///.BookUser.dataValues.comment
        res.render("comment", {comment:myComment  ,comments: allComments,theTitle : title, myBook : theBook} )
        console.log("//////////   2  //////////////////")
        console.log(allComments.BookUser)
       /// next()
    } 
    catch (error) {
        next(error) //call middleware 
    }
}

const updateComment = async(req,res, next) => {

    try {
        await BookList.addComment({
            "title":  req.body["staticTitle"], 
            "comment": req.body["comment"] ,
        }, req.session.username)
        next()
    } catch (error) {
        next(error) //call middleware 
    }
}



export {showBookList,addBook,deleteBook,showBookComments,updateComment}
import  * as BookList  from '../model/bookList_model.mjs'

const doLogin= async (req,res,next) => {
    try {
    //elegxos ok
    const user = await BookList.login(req.body.username, req.body.password)
    if (user) {
        req.session.username = req.body.username // Tο username μπαίνει σαν μεταβλητή συνεδριας
        res.locals.username = req.session.username // Tα μέλη του res.locals είναι απευθείας προσβάσιμα στο template 
        next()//το επόμενο middleware ειναι το showBookList
    }
    else {
        throw new Error("Άγνωστο σφάλμα")
    }
}catch (error) {
    next(error)
}
}

const doRegister = async (req,res,next) => {

    const username = req.body.username
    const password = req.body.password

    try {

        const user = await BookList.addUser(username,password)
        if (user){
            res.render("home",{newusermessage: "Η εγγραφή του χρήστη έγινε με επιτυχία "})
        }
            else {
                throw new Error("Σφάλμα κατά την εγγραφή του χρήστη!")
            }
    }catch (error) {
        next(error)
    }
}

const doLogout = async(req,res,next) => {
    req.session.destroy()
    next()
}

async function checkIfAuthenticated (req,res,next) {
    if(req.session.username){
        res.locals.username =req.session.username
        next()
    }
    else
    res.redirect("/") 
}

export{checkIfAuthenticated,doLogin,doRegister,doLogout}
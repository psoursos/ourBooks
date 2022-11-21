import { body,validationResult } from 'express-validator'
import validator from 'validator'

const validateLogin = [
    body("username")
        .trim().escape().isLength({min:4})// Θα μπορούσαμε να έχουμε και άλλους ελέγχους
        .withMessage("Δώστε όνομα με τουλάχιστον 4 χαρακτήρες"),
  (req,res,next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()) {
        next()
    } else {
        //o έλεγχος εγκυρότητας δεν είναι Οκ, άρα δεν καλούμε τη next()
        res.render("home", {message: errors.mapped() })
    }
}
]

const validateNewBook = [
    body("newBookTitle")
        .custom(value => {
            for (let ch of value) {
                if (!validator.isAlpha(ch,'el-GR') &&
                    !validator.isAlpha(ch,'en-US') &&
                    !validator.isNumeric(ch,'en-US') &&
                    ch != ' ' && 
                    ch !='.'){
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες')
            }
        }
            return true;
    })
        .trim().escape()
        .isLength({min:5})
        .withMessage("Τουλάχιστον 5 γράμματα"),
    body("newBookAuthor")
        .custom(value => {
            for (let ch of value){
                if (!validator.isAlpha(ch,'el-GR') &&
                    !validator.isAlpha(ch,'en-US') &&
                    ch != ' ' && 
                    ch !='.'){
                    throw new Error('Επιτρέπονται ελληνικοί και λατινικοί χαρακτήρες')
            } 
            }
            return true;
        })
        .trim().escape()
        .isLength({min:5})
        .withMessage("Τουλάχιστον 5 γράμματα"),
    (req,res,next)=> {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        }
        else {
            res.render("addbookform", {
                message: errors.mapped(),
                //send to addBookForm bootstrap 
                title:req.body["newBookTitle"],
                author:req.body["newBookAuthor"]
            })
        }
    }
]

const validateNewUser = [

    body("username")
    .trim().escape().isLength({min:4})
    .withMessage("Δώστε όνομα με τουλαχιστον 4 χαρακτήρες!"),
    body("password")
    .trim()
    .isLength({min:4, max:10})
    .withMessage("Το συνθηματικό πρέπει να έχει  από 4 μέχρι 10 χαρακτήρες!"),
    body("password-confirm")
    .trim()
    .isLength({min:4, max:10})
    .withMessage("Το συνθηματικό πρέπει να έχει  από 4 μέχρι 10 χαρακτήρες!")
    // custom validator
    .custom((value, {req}) => {
        if (value!= req.body.password){
            throw new Error("Το συνθηματικό πρέπει να είναι ίδιο και στα δύο πεδία")
        } else {
            return true
        }
    }),
    async(req,res,next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()){
            next()
        }
        else {
            res.render("registrationform",{
                message:errors.mapped()
        })
    }
}
]

export {validateLogin,validateNewBook,validateNewUser}
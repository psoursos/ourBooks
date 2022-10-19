// 
//                using router 
// 
import express from 'express'

const router = express.Router()




router.get("/random",(req,res) => {
    console.log("A Random Book !")
    res.send("A Random Book !")
})

export {router}
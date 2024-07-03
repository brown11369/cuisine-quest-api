const express =require("express");
const router=express.Router()

const { register, handleLogin }=require("../controllers/admin")

router.post("/register",register)
router.post("/login",handleLogin)

module.exports = router;
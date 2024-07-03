const express = require("express");
const router = express.Router()
const { register, login, logout } = require("../controllers/user")
const verifyJWT = require("../middlewares/verifyJWT")

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/testing", verifyJWT, (req, res) => { return res.send("testing successfull") })


module.exports = router;
const express = require("express")
const router = express.Router()
const checkoutController = require("../controllers/checkout")

router.post("/create-session", checkoutController)

module.exports = router;
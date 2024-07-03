const express = require("express")
const router = express.Router()
const accessToken = require("../controllers/accessToken")

router.post("/generate/:modelURL", accessToken)

module.exports = router;


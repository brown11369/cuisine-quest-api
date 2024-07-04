const express = require("express")
const { allOrder } = require("../controllers/order")

const router = express.Router()


router.get("/:id", allOrder)


module.exports = router;
const express = require("express")
const router = express.Router()
const { checkoutController, completeOrder, cancelOrder } = require("../controllers/checkout")

router.post("/create-session", checkoutController)
router.patch("/complete/:id", completeOrder)
router.patch("/cancel/:id", cancelOrder)

module.exports = router;
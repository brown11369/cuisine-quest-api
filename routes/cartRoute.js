const express = require("express")
const router = express.Router()
const { additem, manageQuantity, allItems, removeItem } = require("../controllers/cart")
const verifyJWT = require("../middlewares/verifyJWT")

router.post("/add", additem)
router.post("/quantity/:id", manageQuantity)
router.get("/items/:userID", allItems)
router.delete("/remove/:itemID", verifyJWT, removeItem)

module.exports = router;
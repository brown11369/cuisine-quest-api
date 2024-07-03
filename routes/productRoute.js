const express = require("express")
const router = express.Router()


const { addProduct, allProducts, allPublishedProducts, productByID, restaurantProducts, updateProduct, deleteProduct } = require("../controllers/product")


router.post("/add", addProduct)
router.get("/all", allProducts)
router.get("/published", allPublishedProducts)
router.get("/:id", productByID)
router.get("/restaurant/:id", restaurantProducts)
router.patch("/edit/:id", updateProduct)
router.delete("/delete/:id", deleteProduct)


module.exports = router;
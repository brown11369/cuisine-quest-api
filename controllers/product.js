const productModel = require("../model/productModel")


const addProduct = async (req, res) => {
    try {
        const productData = req.body
        if (!productData.restaurant || !productData?.name || !productData?.price) return res.status(400).send({ success: false, message: "recipe name and price are required" })

        //create new recipe 
        const newFood = new productModel(productData);
        await newFood.save();
        res.status(201).json({ success: true, message: "product added" });
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}


const allProducts = async (req, res) => {
    try {
        const products = await productModel.find()
        res.send({ success: true, productData: products });
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}


const allPublishedProducts = async (req, res) => {
    try {
        const products = await productModel.find({ status: "published" })
        res.send({ success: true, productData: products });
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}


const productByID = async (req, res) => {
    try {
        let productID = req.params.id;
        const product = await productModel.findById({ _id: productID })
        res.send({ success: true, productData: product });
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}


const restaurantProducts = async (req, res) => {
    try {
        let restaurantID = req.params.id;
        const product = await productModel.find({ restaurant: restaurantID })
        res.send({ success: true, productData: product });
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}


const updateProduct = async (req, res) => {
    try {
        let productData = req.body
        let productID = req.params.id;

        const foundproduct = await productModel.findOne({ _id: productID })
        if (!foundproduct) return res.status(404).send({ success: false, message: "this product does not exist" })

        await productModel.updateOne({ _id: productID }, productData)

        res.send({ success: true, message: "product updated" })
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}


const deleteProduct = async (req, res) => {
    try {
        let productID = req.params.id;
        await productModel.deleteOne({ _id: productID })

        res.send({ success: true, message: "product deleted" })
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}

module.exports = { addProduct, allProducts, allPublishedProducts, productByID, restaurantProducts, updateProduct, deleteProduct }
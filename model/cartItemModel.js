const mongoose = require("mongoose")


const cartItemSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
    },
    quantity: {
        type: Number
    }
}, { timestamps: true })

const cartItemModel = mongoose.model("cartItems", cartItemSchema)

module.exports = cartItemModel;
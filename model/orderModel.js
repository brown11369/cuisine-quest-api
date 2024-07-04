const mongoose = require("mongoose")


const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    paymentInfo: {
        type: String,
    },
    status: {
        type: Number,
        default: 0
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number
        },
    }],
    totalItems: {
        type: Number
    },
    totalPrice: {
        type: Number
    }
}, { timestamps: true })

const orderModel = mongoose.model("orders", orderSchema)

module.exports = orderModel;
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
    order: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number
        },
    }],
    totalprice: {
        type: Number
    }
}, { timestamps: true })

const orderModel = mongoose.model("orders", orderSchema)

module.exports = orderModel;
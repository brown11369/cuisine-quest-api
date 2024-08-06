const mongoose = require("mongoose");

// Define the schema for customer details
const customerDetailsSchema = mongoose.Schema({
    address: {
        city: { type: String, required: true },
        country: { type: String, required: true },
        line1: { type: String, required: true },
        line2: { type: String },
        postal_code: { type: String, required: true },
        state: { type: String, required: true }
    },
    email: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    tax_exempt: { type: String, default: 'none' },
    tax_ids: [{ type: String }]
});

// Define the main order schema
const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
        index: true // Indexing the user field
    },
    paymentInfo: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3] // statuses: 0 - pending, 1 - completed, 2 - shipped, 3 - canceled
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1 // Ensuring quantity is at least 1
        }
    }],
    totalItems: {
        type: Number,
        default: 0,
        min: 0 // Ensuring totalItems is non-negative
    },
    totalPrice: {
        type: Number,
        default: 0,
        min: 0 // Ensuring totalPrice is non-negative
    },
    payment_intent: {
        type: String
    },
    customer_details: {
        type: customerDetailsSchema
    },
}, { timestamps: true });

const orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
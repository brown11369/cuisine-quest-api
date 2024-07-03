const mongoose = require("mongoose")


const productSchema = mongoose.Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "restaurants",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        default: "starter"
    },
    price: {
        type: Number,
        required: true
    },
    features: {
        type: []
    },
    ingredients: {
        type: [String]
    },
    imageURL: {
        type: String
    },
    altTag: {
        type: String
    },
    isVegetarian: {
        type: Boolean,
        default: false
    },
    isVegan: {
        type: Boolean,
        default: false
    },
    isGlutenFree: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "draft"
    },
    url: {
        type: String,
        trim: true,
        lowercase: true,
    },
    keywords: {
        type: [String]
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    }
}, { timestamps: true })

const productModel = mongoose.model("products", productSchema)

module.exports = productModel;
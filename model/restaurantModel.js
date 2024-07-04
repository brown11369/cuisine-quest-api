const mongoose = require("mongoose")


const restaurantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: String,
        required: true,
    },
    ownerName: {
        type: String,
        required: true,
    },
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        pin: {
            type: String,
        }
    },
    open: {
        type: String,
    },
    close: {
        type: String,
    },
    imageURL: {
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })




const ownerModel = mongoose.model("restaurants", restaurantSchema)

module.exports = ownerModel;
const mongoose = require("mongoose")


const adminSchema = mongoose.Schema({
    name: {
        type: String,
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
    address: {
        type: String,
    },
    roleName:{
        type:String,
        default:"noob"
    },
    roles: {
        type: [Number],
        default:[2050]
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

const adminModel = mongoose.model("admins", adminSchema)

module.exports = adminModel;
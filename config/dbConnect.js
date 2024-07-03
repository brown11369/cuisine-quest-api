const mongoose = require("mongoose");
const dbConnect = async () => {
    try {
        console.log("database connected")
        await mongoose.connect(process.env.MONGODB_URL)
    }
    catch (err) {
        console.error(err)
    }
}

module.exports=dbConnect;
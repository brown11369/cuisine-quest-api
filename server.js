require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose")
const dbConnect = require("./config/dbConnect")
const cookieParser = require("cookie-parser");
const credentails = require("./middlewares/credentails")
const corsOptions = require("./config/corsOptions")


const PORT = process.env.PORT

// Connecting database
dbConnect()


// custom middleware for handle preflight
app.use(credentails);

// custom middleware for CORS
app.use(cors(corsOptions));

app.use(express.json())

//middleware for cookies
app.use(cookieParser())

// app.use(express.static('public'));


const admin = require("./routes/adminRoute")
const restaurant = require("./routes/restaurantRoute")
const user = require("./routes/userRoute")

const accessToken = require("./routes/accessTokenRoute")

const product = require("./routes/productRoute")
const cart = require("./routes/cartRoute")
const order = require("./routes/orderRoute")
const checkout = require("./routes/checkoutRoute")

//  ------------------Routes------------------    //


const router = express.Router();

// Register routes
router.use("/admin", admin)
router.use("/restaurant", restaurant)
router.use("/user", user)

router.use("/access-token", accessToken)

router.use("/product", product)
router.use("/cart", cart)
router.use("/order", order)
router.use("/checkout", checkout)

//  ------------------Routes------------------    //


// Mount the version "/api/v2" router
app.use("/api/v2", router);


// Handle 404 errors
app.use("*", (req, res) => {
    res.status(404).send({ error: "void" })
})



mongoose.connection.once("open", () => {
    console.log("database connected")
    app.listen(PORT, () => {
        console.log(`server up and running on port ${PORT}`)
    })
})
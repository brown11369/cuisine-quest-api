require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose")
const dbConnect = require("./config/dbConnect")
const cookieParser = require("cookie-parser");
const credentails = require("./middlewares/credentails")
const corsOptions = require("./config/corsOptions")
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


const PORT = process.env.PORT || 3000;
const API_VERSION=process.env.API_VERSION

// Connecting database
dbConnect()


// custom middleware for handle preflight
app.use(credentails);

// custom middleware for CORS
app.use(cors(corsOptions));

app.use(express.json())

//middleware for cookies
app.use(cookieParser())

// Set security HTTP headers
app.use(helmet());

// Implement rate limiting for API endpoints
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);


const admin = require("./routes/adminRoute")
const restaurant = require("./routes/restaurantRoute")
const user = require("./routes/userRoute")
const accessToken = require("./routes/accessTokenRoute")
const product = require("./routes/productRoute")
const cart = require("./routes/cartRoute")
const order = require("./routes/orderRoute")
const checkout = require("./routes/checkoutRoute")

const stripeWebHook=require("./routes/stripeWebHook")



const router = express.Router();

//Routes
router.use("/admin", admin)
router.use("/restaurant", restaurant)
router.use("/user", user)
router.use("/access-token", accessToken)
router.use("/product", product)
router.use("/cart", cart)
router.use("/checkout", checkout)
router.use("/order", order)

router.use("/stripe-webhook",stripeWebHook)





// Mount the version "/api/v2" router
app.use(API_VERSION, router);


// Handle 404 errors
app.use("*", (req, res) => {
    res.status(404).send({ error: "void" })
})



// Error handling middleware

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

mongoose.connection.once("open", () => {
    console.log("Database connected");
    app.listen(PORT, () => {
        console.log(`Server up and running on port ${PORT}`);
    });
});
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose")
const dbConnect= require("./config/dbConnect")
const cookieParser = require("cookie-parser");
const credentails=require("./middlewares/credentails")
const corsOptions=require("./config/corsOptions")


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


const admin=require("./routes/adminRoute")
const restaurant = require("./routes/restaurantRoute")
const user = require("./routes/userRoute")

const accessToken=require("./routes/accessTokenRoute")

const product = require("./routes/productRoute")
const cart = require("./routes/cartRoute")
const order = require("./routes/orderRoute")
const checkout=require("./routes/checkoutRoute")

//  ------------------Routes------------------    //


const router = express.Router();

// Register routes
router.use("/admin", admin)
router.use("/restaurant", restaurant)
router.use("/user", user)

router.use("/access-token",accessToken)

router.use("/product", product)
router.use("/cart", cart)
router.use("/order", order)
router.use("/checkout", checkout)

//  ------------------Routes------------------    //

// app.post('/create-checkout-session', async (req, res) => {

//     try {
//         let orderdata = req.body;

//         const lineitems = await Promise.all(

//             orderdata?.map((list) => {

//                 return {
//                     price_data: {
//                         currency: "inr",
//                         product_data: {
//                             name: list?.foodid.name,
//                         },
//                         unit_amount: Math.round(list?.foodid.price * 100),
//                     },
//                     quantity: list?.quantity
//                 }
//             })
//         )

//         const session = await stripe.checkout.sessions.create({
//             mode: 'payment',
//             success_url: `${process.env.STRIPE_URL}/order?success=true`,
//             cancel_url: `${process.env.STRIPE_URL}/order?canceled=true`,
//             line_items: lineitems,
//             shipping_address_collection: { allowed_countries: ['US', 'IN'] },
//             payment_method_types: ["card"],

//         });




//         await orderModel.create({ userid: orderdata[0]?.userid, paymentInfo: session.id, status: 3, order: orderdata })


//         res.json({ stripeSession: session })
//     } catch (err) {
//         console.log(err)
//     }

// });


// Mount the "/api/v1" router



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
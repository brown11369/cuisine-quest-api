const express = require("express");
const router = express.Router()


const { register, login, logout, allRestaurants, restaurant } = require("../controllers/restaurant")

const orderModel = require("../model/orderModel");


router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/all", allRestaurants)
router.get("/:id", restaurant)


router.get("/orders/:id", (req, res) => {
    let ord = [];

    let neword = []
    let restID = req?.params?.id;
    orderModel.find().populate({ path: 'order', populate: { path: 'foodid' } })
        .then((data) => {
            data.forEach((list, index) => {
                ord.push(...list.order)
            })
            ord.forEach((food, index) => {
                neword.push(food)
            })
            res.send(neword?.filter((element, index) => {

                if (element?.foodid?.restaurant == restID) {
                    return element
                }
            }))
        })
        .catch((err) => {
            console.error(err)
            res.send({ success: false, message: "please try again later" })
        })
})

router.get("/:id", (req, res) => {
    let restaurantID = req.params.id;
    foodModel.findById({ _id: restaurantID })
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            console.error(err)
            res.send({ success: false, message: "please try again later" })
        })
})

module.exports = router;
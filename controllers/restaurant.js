const bcrypt = require("bcrypt")
const restaurantModel = require("../model/restaurantModel")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    try {
        const { name, email, contact, ownerName, address, open, close, imageURL, password } = req.body;
        if (!email || !password) return res.status(400).send({ success: false, message: "email and password required." })

        const existRestaurant = await restaurantModel.findOne({ email })
        if (existRestaurant) return res.status(409).send({ success: false, message: "email already exists" }); //conflict
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //create user with hashed password
        const newRestaurant = new restaurantModel({
            name,
            email,
            contact,
            ownerName,
            address,
            open,
            close,
            imageURL,
            password: hashedPassword,
        });

        await newRestaurant.save();

        res.status(201).json({ success: true, message: "registered! please login now" });
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ success: false, message: "email and password required" })

        //find the user from db
        const foundRestaurant = await restaurantModel.findOne({ email })

        //check if user exists
        if (!foundRestaurant) return res.status(401).send({ success: false, message: "invaild email and password" })

        //checking password
        const passwordMatch = await bcrypt.compare(password, foundRestaurant.password)

        if (passwordMatch) {
            const accessToken = jwt.sign(
                { email: foundRestaurant.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1m" }
            )

            const refreshToken = jwt.sign(
                { email: foundRestaurant.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "7d" }
            )

            let { _id, name, email } = foundRestaurant;

            foundRestaurant.refreshToken = refreshToken;
            foundRestaurant.save()

            res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

            res.status(200).send({ success: true, message: "logged in", credential: { _id, name, email, accessToken } })
        }
        else {
            res.status(401).send({ success: false, message: "invaild email and password" })
        }
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}


const logout = async (req, res) => {
    try {
        const cookies = req.cookies;
        if (!cookies?.jwt) return res.status(200).send({ success: true, message: "your session already expired" })

        const refreshToken = cookies?.jwt
        const foundRestaurant = await restaurantModel.findOne({ refreshToken: refreshToken })
        if (!foundRestaurant) {
            res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
            return res.sendStatus(204)      //success:OK but no content
        }

        foundRestaurant.refreshToken = "",
            foundRestaurant.save()
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
        res.status(200).send({ success: true, message: "you are logged out" })

    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}


const restaurant = async (req, res) => {
    try {
        let restaurantID = req.params.id;
        const foundRestaurant = await restaurantModel.findById({ _id: restaurantID })
        res.send({ success: true, foundRestaurant });
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}


const allRestaurants = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find()
        res.status(200).send({ success: true, restaurants })
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}



module.exports = { register, login, logout, allRestaurants, restaurant };
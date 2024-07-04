const bcrypt = require("bcrypt")
const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    try {
        const { name, email, password, contact, address, shippingAddress } = req.body;
        if (!email || !password) return res.status(400).send({ success: false, message: "email and password required." })

        const existUser = await userModel.findOne({ email })
        if (existUser) return res.status(409).send({ success: false, message: "email already exists" }); //conflict
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //create user with hashed password
        const newUser = new userModel({
            name,
            email,
            contact,
            address,
            shippingAddress,
            password: hashedPassword,
        });

        await newUser.save();

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
        const foundUser = await userModel.findOne({ email })

        //check if user exists and checking password
        if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) return res.status(401).send({ success: false, message: "invaild email and password" })

        if (foundUser?.isBlocked) return res.status(401).send({ success: false, message: "You are blocked." });

        const accessToken = jwt.sign(
            {
                "userInfo": {
                    "email": foundUser?.email,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1m" }
        )

        const refreshToken = jwt.sign(
            { email: foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        )

        let { _id, name } = foundUser;

        foundUser.refreshToken = refreshToken;
        foundUser.save()

        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })

        res.status(200).send({ success: true, message: "logged in", userInfo: { _id, name, email, accessToken } })
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }

}


const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.jwt;
        if (!refreshToken) return res.status(200).send({ success: true, message: "Your session is already expired." })

        const foundUser = await userModel.findOne({ refreshToken })
        if (!foundUser) {
            res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
            return res.status(200).send({ success: true, message: "Your session is already expired." });
            //204 = success:OK but no content
        }

        foundUser.refreshToken = "",
            foundUser.save()

        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
        res.status(200).send({ success: true, message: "You are logged out successfully." });
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }
}




module.exports = { register, login, logout };
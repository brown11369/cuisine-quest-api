const bcrypt = require("bcrypt")
const adminModel = require("../model/adminModel")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    try {
        const { name, email, password, contact, address} = req.body;
        if (!email || !password) return res.status(400).send({ success: false, message: "email and password required." })

        const existAdmin = await adminModel.findOne({ email })
        if (existAdmin) return res.status(409).send({ success: false, message: "email already exists" }); //conflict
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        //create user with hashed password
        const newAdmin = new adminModel({
            name,
            email,
            contact,
            address,
            password: hashedPassword,
        });

        await newAdmin.save();

        res.status(201).json({ success: true, message: "new admin registered! please login now" });
    }
    catch (err) {
        res.status(500).send({ success: false, message: err.message })
    }

}


const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send({ success: false, message: "email and password required" })

        //find the user from db
        const foundAdmin = await adminModel.findOne({ email })

        //check if user exists
        if (!foundAdmin) return res.status(401).send({ success: false, message: "invaild email and password" })

        //checking password
        const passwordMatch = await bcrypt.compare(password, foundAdmin.password)

        if (passwordMatch) {

            const roles = foundAdmin?.roles;

            const accessToken = jwt.sign(
                {
                    "credential": {
                        "email": foundAdmin?.email,
                        "roles": roles
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15m" }
            )

            const refreshToken = jwt.sign(
                { email: foundAdmin.email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "7d" }
            )

            let { _id, name, email } = foundAdmin;

            foundAdmin.refreshToken = refreshToken;
            foundAdmin.save()

            res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 })

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

module.exports = { register, handleLogin };
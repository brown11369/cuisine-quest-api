const adminModel = require("../model/adminModel")
const userModel = require("../model/userModel")
const restaurantModel = require("../model/restaurantModel")
const jwt = require("jsonwebtoken")

const accessToken = async (req, res) => {
    const url = req.params.modelURL;

    function setmodel() {
        if (url === "admin") {
            return adminModel
        }
        else if (url === "restaurant") {
            return restaurantModel
        }
        else if (url === "user") {
            return userModel
        }
        else {
            return userModel
        }
    }

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401)

    const refreshToken = cookies?.jwt
    const foundUser = await setmodel().findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(403)      //Forbidden
    const { _id, name, email } = foundUser;
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser?.email !== decoded?.email) return res.sendStatus(401);     //decode?.email because it is not under userInfo

            const accessToken = jwt.sign(
                { "email": decoded?.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1m" }
            );
            res.send({ success: true, credential: { _id, name, email, accessToken } })
        })
}

module.exports = accessToken;
const express = require("express");
const router = express.Router()
const { register, login, logout } = require("../controllers/user")
const { body, validationResult } = require("express-validator");


router.post("/register", [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 7 }),
    // You can Add more validations as needed
],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            await register(req, res);
        } catch (err) {
            next(err);
        }
    }
)

router.post("/login", login)
router.post("/logout", logout)



module.exports = router;
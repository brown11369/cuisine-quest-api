const express = require("express");
const { stripeHook } = require("../controllers/stripeHook");
const router = express.Router();

router.post('/check', stripeHook);

module.exports = router;
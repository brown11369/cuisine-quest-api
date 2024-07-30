const allowedOrigins = require("../config/allowedOrigins");

const credentails = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins?.includes(origin)) {
        res.header("Access-Control-Allow-Creadentials", true);

        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next()
}

module.exports = credentails;
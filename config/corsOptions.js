const allowedOrigins = require("./allowedOrigins");

// Cross Origin Resource Sharing(CORS)
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins?.indexOf(origin) !== -1) {
            callback(null, true)
        }
        else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200,
    credentials: true
}


module.exports = corsOptions;
const orderModel = require("../model/orderModel");

const allOrder = async (req, res) => {
    try {
        let userID = req.params.id;
        // Using await with orderModel.find() and populate() for cleaner async code
        let data = await orderModel.find({ user: userID }).populate({ path: 'items', populate: { path: 'product' } });

        // Sending the data as response
        res.status(200).send({ success: true, orderData: data });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).send({ success: false, message: "Please try again later" });
    }
};

module.exports = { allOrder };
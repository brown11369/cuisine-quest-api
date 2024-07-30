const cartItemModel = require("../model/cartItemModel")


const additem = async (req, res) => {
    try {
        let cartItemData = req.body;
        let { user, product } = cartItemData;
        cartItemData.quantity = cartItemData.quantity || 1;

        if (!user || !product) {
            return res.status(400).send({ success: false, message: "user and product are required" });
        }

        // Check if the item already exists for the given user and product
        const existingCartItem = await cartItemModel.findOne({ user, product });

        if (existingCartItem) {
            return res.send({ success: true, message: "Item already exist" });
        } else {
            const newCartItem = await cartItemModel.create(cartItemData);
            return res.send({ success: true, message: "Item added", data: newCartItem });
        }
    } catch (err) {
        // Log and handle errors
        console.error("Error in additem:", err);
        res.status(500).send({ success: false, message: "Something went wrong" });
    }
};


const manageQuantity = async (req, res) => {
    let cartItemID=req.params.id;
    console.log(cartItemID)
    res.status(400).send({ success: false, message: "user and product are required" });

    // try {
    //     let cartItemData = req.body;
    //     let { user, product } = cartItemData;
    //     cartItemData.quantity = cartItemData.quantity;

    //     if (!user || !product) {
    //         return res.status(400).send({ success: false, message: "user and product are required" });
    //     }

    //     const existingCartItem = await cartItemModel.findOne({ user, product });

    //     if (existingCartItem) {
    //         existingCartItem.quantity = cartItemData.quantity;
    //         await existingCartItem.save();
    //         return res.send({ success: true, message: "Item quantity updated" });
    //     }
    // } catch (err) {
    //     console.error("Error in additem:", err);
    //     res.status(500).send({ success: false, message: "Something went wrong" });
    // }
}


const allItems = async (req, res) => {
    try {
        let userID = req.params.userID;
        let cartItemData = await cartItemModel.find({ user: userID }).populate("product");

        if (!cartItemData) {
            res.status(404).send({ success: false, message: "Items not found" });
            return;
        }

        res.status(200).send({ success: true, cartItemData });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send({ success: false, message: "Internal server error. Please try again later." });
    }
}



const removeItem = async (req, res) => {
    try {
        console.log(req.params.itemID)
        let itemID = req.params.itemID;
        let deletedItem = await cartItemModel.findByIdAndDelete(itemID);

        if (!deletedItem) {
            res.status(404).send({ success: false, message: "Item not found or already removed" });
            return;
        }

        res.status(200).send({ success: true, message: "Item has been removed" });
    } catch (err) {
        console.error("Error removing item:", err);
        res.status(500).send({ success: false, message: "Internal server error. Please try again later." });
    }
}


module.exports = { additem, manageQuantity, allItems, removeItem }
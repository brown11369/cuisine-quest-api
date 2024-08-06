const orderModel = require("../model/orderModel");
const cartItemModel = require("../model/cartItemModel");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const checkoutController = async (req, res) => {
    try {
        let orderData = req.body;
        const lineitems = await Promise.all(
            orderData?.items?.map((list) => {
                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: list?.product?.name,
                            images: [list?.product?.imageURL],
                        },
                        unit_amount: Math.round(list?.product.price * 100),
                    },
                    quantity: list?.quantity
                }
            })
        );
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/orders/complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/orders/cancel?session_id={CHECKOUT_SESSION_ID}`,
            line_items: lineitems,
            shipping_address_collection: { allowed_countries: ['US', 'IN'] },
            payment_method_types: ["card"],
        });
        await orderModel.create({
            user: orderData?.user,
            paymentInfo: session.id,
            status: 0, // initial status is pending || 0 - pending, 1 - completed, 2 - shipped, 3 - canceled
            items: orderData?.items,
            totalItems: orderData?.totalItems,
            totalPrice: orderData?.totalPrice
        });
        res.json({ stripeSession: session })
    } catch (err) {
        console.error('Error in checkout controller:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const completeOrder = async (req, res) => {
    try {
        let { userID } = req.body;
        const sessionID = req.params.id;
        const session = await stripe.checkout.sessions.retrieve(sessionID)

        await orderModel.findOneAndUpdate(
            { paymentInfo: sessionID },
            {
                $set: {
                    status: 1, // initial status is pending || 0 - pending, 1 - completed, 2 - shipped, 3 - canceled
                    payment_intent: session?.payment_intent,
                    customer_details: session?.customer_details
                }
            }
        );

        // Remove all cart items for the user
        const result = await cartItemModel.deleteMany({ user: userID });

        if (result.deletedCount === 0) {
            res.status(404).send({ success: false, message: "No cart items found for this user" });
            return;
        }

        res.status(200).send({ success: true, message: "Cart items have been removed" });

    } catch (err) {
        console.error('Error updating order status:', err);
        return res.status(500).json({ error: 'Failed to update order status' });
    }
}

const cancelOrder = async (req, res) => {
    try {
        const sessionID = req.params.id;

        await orderModel.findOneAndUpdate(
            { paymentInfo: sessionID },
            // initial status is pending || 0 - pending, 1 - completed, 2 - shipped, 3 - canceled
            { $set: { status: 3 } }
        );
        res.status(200).send({ success: true, message: "your checkout failed" });
    } catch (err) {
        console.error('Error updating order status:', err);
        return res.status(500).json({ error: 'Failed to update order status' });
    }
}

module.exports = { checkoutController, completeOrder, cancelOrder };
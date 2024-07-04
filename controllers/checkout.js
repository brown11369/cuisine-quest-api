const orderModel = require("../model/orderModel")
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
        )

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/order?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/order?canceled=true`,
            line_items: lineitems,
            shipping_address_collection: { allowed_countries: ['US', 'IN'] },
            payment_method_types: ["card"],

        });

        await orderModel.create({
            user: orderData?.user,
            paymentInfo: session.id,
            status: 3,
            items: orderData?.items,
            totalItems: orderData?.totalItems,
            totalPrice: orderData?.totalPrice
        })

        res.json({ stripeSession: session })

    } catch (err) {
        console.error('Error in checkout controller:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = checkoutController;
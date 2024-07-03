const orderModel = require("../model/orderModel")
const stripe = require("stripe")(process.env.STRIPE_KEY);

const checkoutController = async (req, res) => {
    // let orderdata = req.body;
    try {
        let orderdata = req.body;
        console.log(orderdata)

        const lineitems = await Promise.all(

            orderdata?.map((list) => {

                return {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: list?.product.name,
                        },
                        unit_amount: Math.round(list?.product.price * 100),
                    },
                    quantity: list?.quantity
                }
            })
        )

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            success_url: `${process.env.STRIPE_URL}/order?success=true`,
            cancel_url: `${process.env.STRIPE_URL}/order?canceled=true`,
            line_items: lineitems,
            shipping_address_collection: { allowed_countries: ['US', 'IN'] },
            payment_method_types: ["card"],

        });
        await orderModel.create({ user: orderdata[0]?.user, paymentInfo: session.id, status: 3, order: orderdata })

        res.json({ stripeSession: session })
    } catch (err) {
        console.log(err)
    }
};

module.exports = checkoutController;
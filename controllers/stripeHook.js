const stripeHook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET); // Use your webhook secret key here
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event based on type
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            // Update your order status in the database
            try {
                await orderModel.findOneAndUpdate(
                    { paymentInfo: session.id },
                    { $set: { status: 'paid' } }
                );
            } catch (err) {
                console.error('Error updating order status:', err);
                return res.status(500).json({ error: 'Failed to update order status' });
            }
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.json({ received: true });
}

module.exports = { stripeHook };
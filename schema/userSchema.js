const userSchema = new mongoose.Schema({
    mobile: { type: String, required: true, unique: true },
    cart: [
        {
            itemId: String,
            name: String,
            quantity: Number,
            price: Number,
        },
    ],
    paymentHistory: [
        {
            paymentId: String,
            amount: Number,
            date: Date,
        },
    ],
    deliveryStatus: [
        {
            orderId: String,
            status: {
                type: String,
                enum: ['Pending', 'Dispatched', 'Delivered', 'Cancelled'],
                default: 'Pending',
            },
            estimatedDelivery: Date,
        },
    ],
});

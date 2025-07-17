const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        name: String,
        email: String,
        mobile: String
    },
    firmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm',
        require: true
    },
    items: [
        {
            productName: String,
            quantity: Number,
            price: Number
        }
    ],
    totalAmount: Number,
    status: {
        type: String,
        enum:['Placed','Accepted','Declined','Out for Delivery'],
        default: 'Placed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
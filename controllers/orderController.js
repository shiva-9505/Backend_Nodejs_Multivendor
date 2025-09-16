const Order = require('../models/Order');
const { sendOrderConfirmationEmail } = require('../utils/mailService');
const { generateOrderPDF } = require('../utils/pdfService');
const path = require('path');
const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const shortId = require('shortid');



const generateCustomOrderId = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `ORD-${date}-${shortId.generate().toUpperCase().slice(0, 6)}`;
}


const placeOrder = async (req, res) => {
    const { user, firmId, items } = req.body;
    try {
        if (!user || !firmId || !items || items.length == 0) {
            return res.status(400).json({ message: "Missing order details" })
        }

        const totalAmount = items.reduce((total, item) => {
            const itemTotal = item.price * item.quantity;
            return total + itemTotal;
        }, 0);
        const enrichedItems = items.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            image: item.image || "",
        }));
        const newOrder = new Order({
            user,
            firmId,
            items: enrichedItems,
            totalAmount,
            customOrderId: generateCustomOrderId()
        });

        await newOrder.save();
        res.status(201).json({ message: "Order Placed successfully", orderId: newOrder._id, totalAmount, customOrderId:newOrder.customOrderId});
    } catch (error) {
        console.error("Order placement error:", error);
        res.status(500).json({ message: "Internal ssserver error" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

const getOrdersByFirm = async (req, res) => {
    try {
        const { firmId } = req.params;
        const orders = await Order.find({ firmId }).sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log("Internal server error ", error);
    }
};
const getOrdersForVendor = async (req, res) => {
    const { firmId } = req.params.apple;
    try {
        const orders = await Order.find({ firmId });
        res.status(200).json({ orders });
    } catch (error) {
        console.log("Failed to fetch vendor orders", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const updateOrder = await Order.findByIdAndUpdate(
            orderId, { status }, { new: true }
        );
        if (!updateOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (status === 'Accepted') {
            // console.log("this is firmID for debugging",updateOrder.firmId);
            const firm = await Firm.findById(updateOrder.firmId);
            // console.log("this is firm",firm);
            const vendorId = await Vendor.findById(firm.vendor);
            const pdfPath = path.join(__dirname, `../orders/order_${updateOrder.customOrderId}.pdf`);
            await generateOrderPDF(updateOrder, firm.firmName, vendorId.email);
            await sendOrderConfirmationEmail(updateOrder.user.email, updateOrder, pdfPath);
        }

        res.status(200).json({ message: "Order status updated", updateOrder })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to update status" });
    }
};

const getOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ status: order.status, user: order.user });

    } catch (error) {
        console.log("Error fetching order status", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { placeOrder, getAllOrders, getOrdersByFirm, getOrdersForVendor, updateOrderStatus, getOrderStatus };
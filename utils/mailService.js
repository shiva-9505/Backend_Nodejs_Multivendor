const nm = require('nodemailer');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const sendOrderConfirmationEmail = async (mailId, orderDetails, attachmentPath) => {
    try {
        const transporter = nm.createTransport({
            // host: 'smtp.gmail.com',
            // port: 587,
            // secure: false,
            service:'gmail',
            auth: {
                user: process.env.FromMail,
                pass: process.env.PassKey
            }
        });
        const orderDate = new Date(orderDetails.createdAt).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata'
        });

        const liveTrackUrl = 'http://'


        const mailOptions = {
            from: process.env.FromMail,
            to: mailId,
            subject: `Your Order has been Accepted and Food is On the Way - Order ID: ${orderDetails.customOrderId}`,
            html:
                `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: green;">Order Accepted!</h2>
                <p>Hi ${orderDetails.user.name},</p>
                <p>Your order <strong>${orderDetails.customOrderId}</strong> has been accepted by the restaurant.</p>
                <h3>Your Total Amount is: <strong>${orderDetails.totalAmount}</strong></h3>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p>You can track your order status using the link below:</p>
                <p><a href="${liveTrackUrl}" target="_blank">${liveTrackUrl}</a></p>
                <br/>
                <h3>Please refer below pdf for order details</h3>
                <p>Thank you for ordering with HungryPlate! 🍽️</p>
                </div>`,
            attachments: attachmentPath ?
                [
                    {
                        filename: 'OrderDetails.pdf',
                        path: attachmentPath
                    }
                ] : []
        };

        await transporter.sendMail(mailOptions);
        //console.log(`📧 Order confirmation email sent to ${mailId}`);

    } catch (error) {
       console.log("Email is failed to send",error);
    }
}

module.exports = { sendOrderConfirmationEmail };
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const dotenv = require('dotenv');
dotenv.config();

const generateOtp = () => { return (Math.floor(100000 + Math.random() * 900000).toString()) };

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.FromMail,
        pass: process.env.PassKey
    }
});

const userRegister = async (req, res) => {
    const { name, email, mobile } = req.body;
    try {
        const userEmail = await User.findOne({ email });
        if (userEmail) {
            return res.status(400).json({ message: "User already registerd" });
        }
        const newUser = new User({
            name,
            email,
            mobile
        });
        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully" });


    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error)
    }
}


const userLogin = async (req, res) => {
    const { email } = req.body;
    try {

        // const apiKey = process.env.ACCESSKEY;
        // const verifyURL = `http://apilayer.net/api/check?access_key=${apiKey}&email=${email}`;

        // const verifyRes = await fetch(verifyURL);
        // const verifyData = await verifyRes.json();

        // if (/*!verifyData.smtp_check || */!verifyData.mx_found) {
        //     return res.status(400).json({ message: "Invalid or unreachable email address" });
        // }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const now = Date.now();
        if (user.otp && user.otpExpiry && user.otpExpiry > now) {
            const secondsLeft = Math.ceil((user.otpExpiry - now) / 1000);
            return res.status(429).json({ message: `OTP already sent. Please wait ${secondsLeft} seconds before requesting a new one.` });
        }


        const newOtp=generateOtp();
        user.otp = newOtp;
        user.otpExpiry = now + 2 * 60 * 1000;
        await user.save();


        try {
            await transporter.sendMail({
                from: process.env.FromMail,
                to: email,
                subject: "Your Login OTP",
                text: `Hello ${user.name}, Your One Time Password(OTP) is ${newOtp}. It is valid only for 2 minutes`
            });
            res.status(200).json({ message: "OTP sent to email" });
        } catch (error) {
            return res.status(400).json({ message: "Invalid email or failed to send OTP" });
        }

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
};

const verifyOtpAndLogin = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const now = Date.now();
        if (!user.otp || !user.otpExpiry || user.otpExpiry < now) {
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
            return res.status(400).json({ message: "OTP expired. Please request a new one." });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.UserJWTSecret, {
            expiresIn: "1d"
        });
        
        res.json({ token, message: "Login successful" });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        console.log(error);
    }
};

module.exports = { userRegister, userLogin, verifyOtpAndLogin };
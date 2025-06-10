const Vendor=require('../models/Vendor');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

dotenv.config();
const secretKey=process.env.WhatIsYourName;

const verifyToken=async(req,res,next)=>{
        const token = req.headers['authorization'];
        //const token = authHeader && authHeader.split(' ')[1]; 
        if(!token){
            return res.status(401).json({error: " Token is required"});
        }

        try {
            const decoded = jwt.verify(token,secretKey);
            const vendor = await Vendor.findById(decoded.vendorId);

            if(!vendor){
                return res.status(404).json({error:" Vendor not found"});
            }
            req.vendorId = vendor._id;

            next();

        } catch (error) {
            console.log(error);
            res.status(500).json({error:"Invalid Token"})
        }
}

module.exports = verifyToken;
const Product=require('../models/Product');
const multer=require('multer');
const Firm=require('../models/Firm');
const path=require('path');
const upload = require("../middlewares/cloudinaryStorage");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//          cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//          const uniqueName = Date.now() + path.extname(file.originalname);
//      cb(null, uniqueName);
//      }
//     });
//     const upload=multer({storage:storage});

const addProduct=async(req,res)=>{
    console.log("===== LIVE PRODUCT API HIT =====");
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    const {productName,price,category,bestSeller,description}=req.body;
    const image=req.file?.path;  //req.file.filename:undefined;
    try {
        const firmId=req.params.firmId;
        const firm=await Firm.findById(firmId);
        if(!firm){
            return res.status(404).json({error:"No firm found"});
        }
        const product=new Product({
            productName,price,category,bestSeller,description,image,firm:firm._id
        });
        const savedProduct=await product.save();
        firm.products.push(savedProduct);
        await firm.save();

        res.status(200).json({savedProduct});

    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})

    }

}

const getProductByFirm= async (req,res)=>{
    try {
        const firmId=req.params.firmId;
        const firm= await Firm.findById(firmId);

        if(!firm){
           return res.status(404).json({error:"No firm found"});
        }

        const restaurantName= firm.firmName;
        const products=await Product.find({firm: firmId});
        res.status(200).json({restaurantName, products});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}

const deleteProductById=async (req,res)=>{
    try {
        const productId=req.params.productId;
        const deletedProduct =await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(404).json({error:" No product found"});

        }
        res.status(200).json({message:" Product deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}

module.exports={addProduct:[upload.single('image'), addProduct ], getProductByFirm, deleteProductById};
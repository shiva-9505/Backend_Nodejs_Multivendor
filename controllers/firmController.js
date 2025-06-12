const Firm=require('../models/Firm');
const Vendor=require('../models/Vendor');
const multer=require('multer');
const path=require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
         cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
         const uniqueName = Date.now() + path.extname(file.originalname);
     cb(null, uniqueName);
     }
    });
    const upload=multer({storage:storage});


const addFirm = async(req,res)=>{
    console.log("Incoming request body:", req.body);

  try{
    const {firmName,area, category, region,offer}=req.body;

    const image=req.file? req.file.filename: undefined;
    const vendor = await Vendor.findById(req.vendorId);

    if(!vendor){
        res.status(404).json({message:"vendor not found"})
    }
    /*added for adding only one restaurent to one vendor*/
     if(vendor.firm.length>0){
        return res.status(400).json({message:"Vendor can have only one firm"});
    }

    const firm=new Firm({
        firmName,
        area,
        category,
        region,
        offer,
        image,
        vendor: vendor._id
    })

    const savedFirm = await firm.save();
    /*added this */
    const firmId=savedFirm._id;

    vendor.firm.push(savedFirm);
    await vendor.save();
   
    /*sending firmId as response to frontend */
    res.status(200).json({message:"Firm added Successfully", firmId});

 }catch(error){
    console.log(error);
    res.status(500).json({error:"Internal server error"});

 }

}

const deleteFirmById=async(req,res)=>{
    try {
        const firmId=req.params.firmId;
        const deletedFirm= await Firm.findByIdAndDelete(firmId);
        if(!deletedFirm){
            return res.status(404).json({error:"No firm Found"});

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal server error"})
    }
}


module.exports = {addFirm:[upload.single('image'),addFirm], deleteFirmById};
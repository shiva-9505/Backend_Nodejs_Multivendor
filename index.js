const express=require("express");
const dotenv=require("dotenv"); 
const mongoose=require("mongoose");
const vendorRoutes=require('./routes/vendorRoutes');
const bodyParser=require('body-parser');
const firmRoutes=require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes');
const path=require('path');


const port= process.env.PORT || 5000;
const app=express();
dotenv.config();
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB connected successfully");
    })
    .catch((error)=>{
        console.log(error);
    })

    
app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));


app.listen(port,()=>{
    console.log(`server started and running at port ${port}`);
});

app.use('/home',(req,res)=>{
    res.send("<h1>Welcome to Somato Application");
})

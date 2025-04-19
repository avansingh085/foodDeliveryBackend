const express=require("express");
const router=express.Router();
const multer=require("multer");
const path=require("path");
const Image=require('../schema/Image');
const port=process.env.PORT||5000;
const storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,"uploads/"),
    filename:(req,file,cb)=>cb(null,Date.now()+path.extname(file.originalname))})
const upload=multer({storage});
router.post("/upload",upload.single("file"),async(req,res)=>{
    if(!req.file){
        return res.status(400).send("No file uploaded.");
    }
    const imageUrl=`http://localhost:${port}/uploads/${req.file.filename}`;
    const newImage=new Image({
        name:req.body.name||"Unnamed Image",
        description:req.body.description||"No description provided",
        imageUrl,
    });
    await newImage.save();
    res.status(200).json({imageUrl});
})

router.get("/uploads",express.static("uploads"));

module.exports=router;
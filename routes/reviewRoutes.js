const express=require("express");
const router=express.Router();
const multer=require("multer");
const path=require("path");
const {addReview}=require("../controller");
const {authenticateToken}=require("../controller");
const storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,"uploads/"),
    filename:(req,file,cb)=>cb(null,Date.now()+pathextname(file.originalname)),

})
const upload=multer({storage});
router.post("/addReview",authenticateToken,upload.array("capturedImages",5),addReview);
module.exports=router;
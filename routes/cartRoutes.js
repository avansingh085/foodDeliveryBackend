const express=require("express");
const router=express.Router();
const {getCart,addCart,updateCart,deleteCart}=require("../controllers/cartController");
const authenticateToken=require("../middilwares/auth.middilwares");
router.get("/getCart",authenticateToken,getCart);
router.post("/addCart",addCart);
router.post("/updateCart",updateCart);
router.post("/deleteCart",deleteCart);
module.exports=router;
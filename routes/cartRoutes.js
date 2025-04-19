const express=require("express");
const router=express.Router();
const {getCart,addCart,updateCart,deleteCart}=require("../controller");
const {authenticateToken}=require("../controller");
router.get("/getCart",authenticateToken,getCart);
router.post("/addCart",addCart);
router.post("/updateCart",updateCart);
router.post("/deleteCart",deleteCart);
module.exports=router;
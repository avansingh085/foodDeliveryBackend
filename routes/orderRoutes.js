const express=require("express");
const router=express.Router();
const {getOrder,addOrder}=require("../controller");
const {authenticateToken}=require("../controller");
router.get("/getOrder",authenticateToken,addOrder);
router.post("/addOrder",authenticateToken,getOrder);

module.exports=router;
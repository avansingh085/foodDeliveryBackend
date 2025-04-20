const express=require("express");
const router=express.Router();
const {getOrder,addOrder}=require("../controller");
const {authenticateToken}=require("../controller");

router.get("/getOrder",authenticateToken,getOrder);
router.post("/addOrder",authenticateToken,addOrder);

module.exports=router;
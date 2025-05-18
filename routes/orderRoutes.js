const express=require("express");
const router=express.Router();
const {getOrder,addOrder}=require("../controllers/orderController");
const authenticateToken=require("../middilwares/auth.middilwares");

router.get("/getOrder",authenticateToken,getOrder);
router.post("/addOrder",authenticateToken,addOrder);

module.exports=router;
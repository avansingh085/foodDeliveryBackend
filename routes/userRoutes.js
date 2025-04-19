const express=require("express");
const router=express.Router();
const {profile}=require("../controller");
const {authenticateToken}=require("../controller");
router.get("/profile",authenticateToken,profile);
module.exports=router;
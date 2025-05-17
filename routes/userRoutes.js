const express=require("express");
const router=express.Router();
const {userData}=require("../controller");
const {authenticateToken}=require("../controller");
router.get("/user/fetchUser",authenticateToken,userData);
module.exports=router;
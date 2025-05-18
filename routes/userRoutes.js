const express=require("express");
const router=express.Router();
const {userData}=require("../controllers/userController");
const authenticateToken=require("../middilwares/auth.middilwares");
router.get("/user/fetchUser",authenticateToken,userData);
module.exports=router;
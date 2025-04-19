const express=require("express");
const router=express.Router();
const {getMenu,getFood,addNewFood}=require("../controller");
router.get("/getMenu",getMenu);
router.get("/food/:id",getFood);
router.post("/addNewFood",addNewFood);
module.exports=router;
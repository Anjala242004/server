const express = require("express")
const{addFood,listFood,removeFood}=require("../control/foodcontrol")
const uploads= require("../multerfiles/uploads")


const router =express.Router();

router.post("/addFood",uploads.single("image"),addFood)
router.get("/list",listFood)
router.post("/remove",removeFood)



module.exports=router
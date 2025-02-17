const foodmodel = require("../model/foodmodel");
const fs = require('fs');
const path = require('path');

//add food
const addFood = async (req, res) => {
    console.log("File received:", req.file); // Debugging line
  
    if (!req.file) {
      return res.status(400).json({ status: 0, msg: "File upload failed" });
    }
  
    const { name, description, price, category } = req.body;
  
    try {
      await foodmodel.create({
        name,
        description,
        price,
        category,
        image: req.file.filename,
      });
  
      res.json({ status: 1, msg: "Food added successfully" });
    } catch (error) {
      console.error("Error saving Food:", { error, requestBody: req.body });
      res.status(500).json({ status: 0, msg: "Failed to save product", error });
    }
  };
  
//all food list
const listFood = async(req,res)=>{
      try {
          const foods = await foodmodel.find({});
          res.json({success:true,data:foods})
      } catch (error) {
          console.log(error);
          res.json({success:false,message:"Error"})
      }
}

//remove food items

const removeFood = async (req, res) => {
    try {
        console.log("Food ID:", req.body.id); // Debugging

        // Find the food item by ID
        const food = await foodmodel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        // Delete the image file if it exists
        const imagePath = `uploads/${food.image}`;
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                }
            });
        }

        // Delete the food item from the database
        await foodmodel.findByIdAndDelete(req.body.id);

        res.status(200).json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.error("Error removing food:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports={addFood,listFood,removeFood}
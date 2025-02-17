const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./router/routes");
const user = require("./router/userrouter");
const dotenv = require("dotenv");
const cart = require("./router/cartrouter");
dotenv.config();
const payment=require('./router/payrouter')

const order = require("./router/orderrouter");
const Razorpay = require('razorpay');


const app = express();

const MONGO_URI = "mongodb://localhost:27017/Olive";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully."))
  .catch((error) => console.error("MongoDB connection error:", error.message));

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/user",user)
app.use("/cart",cart)
app.use("/order",order);

app.get("/",(req,res)=>{
    res.send("Api working")
})

app.use("/api/food",router)

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
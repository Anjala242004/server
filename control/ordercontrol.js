const { query } = require("express");
const Order = require("../model/ordermodel");
const usermodel = require("../model/usermodel");
const foodmodel=require("../model/foodmodel")
const mongoose = require("mongoose");

const placeOrder = async (req, res) => {
  const { userId, billingDetails, products, totalAmount, paymentMethod } = req.body;

  if (!billingDetails || !billingDetails.address || !products || products.length === 0 || !totalAmount || !paymentMethod) {
    return res.status(400).json({ message: 'Missing required order details' });
  }
  const convertedUserId = new mongoose.Types.ObjectId(userId);

  // Convert productId and ensure quantity is a number
  const convertedProducts = products.map(product => ({
    productId: new mongoose.Types.ObjectId(product.productId),
    quantity: Number(product.quantity),
  }));

  try {
    const newOrder = new Order({
      userId:convertedUserId,
      billingDetails,
      products:convertedProducts,
      totalAmount,
      paymentMethod,
    });

    const savedOrder = await newOrder.save();
    console.log(savedOrder._id)
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder,orderId:savedOrder._id});
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate(
      "products.productId",
      "name price image"
    );
    if (orders.length === 0) {
      return res.status(200).json({ message: "No orders found", orders });
    }
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
};


const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);  // Log error details
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    if (status === "Paid" && paymentId) {
      order.paymentId = paymentId;
    }

    await order.save();
    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error });
  }
};

const totalorder = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.status(200).json({ total: totalOrders });
  } catch (error) {
    console.error("Error fetching total orders:", error);
    res.status(500).json({ message: "Error fetching total orders", error });
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  totalorder,
};
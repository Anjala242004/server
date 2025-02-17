const mongoose = require('mongoose')
const usermodel=require('./usermodel')

const foodSchema = new mongoose.Schema({
        name:{type:String},
        description: {type:String},
        price: {type:Number},
        category:{type:String},
        image:{type:String}},{timestamps:true}
    );

const  foodmodel =mongoose.model('food',foodSchema)

module.exports=foodmodel


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const foodItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required:true,
    trim: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  imageUrl: {
    type: String, 
    required: false
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;

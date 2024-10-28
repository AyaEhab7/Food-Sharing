const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  sharedFoodItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem', // Reference to FoodItem model
  }],  
});

module.exports = mongoose.model('User', userSchema);

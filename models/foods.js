const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5 
  } // Ensure rating is between 1 and 5
});

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Trim whitespace
  },
  expiration_date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
  
  },
  ratings: [ratingSchema], // Store user ratings

});

// Export the Food model
module.exports = mongoose.model('Foods', foodSchema);

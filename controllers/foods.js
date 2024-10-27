const express = require('express');
const router = express.Router();

const food = require('../models/foods');

// Index route: Get all food items
router.get('/', async (req, res) => {
    try {
      const foodItems = await food.find({}).populate('user_id', 'username'); // Populate the user info
      console.log('Food Items:', foodItems);
      res.render('foods/index.ejs', {
        foodItems,
      });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
});


module.exports = router;

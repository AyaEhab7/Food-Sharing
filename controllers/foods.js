const express = require('express');
const router = express.Router();

const foods = require('../models/foods');

//http://localhost:3000/foods
// Index route: Get all foods items
router.get('/', async (req, res) => {
    try {
      const foodItems = await foods.find({}).populate('user_id', 'username'); // Populate the user info
      console.log('Foods Items:', foodItems);
      res.render('foods/index.ejs', {
        foodItems,
      });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
});

http://localhost:3000/foods/new
// New route: Render form to create a new foods item
router.get('/new', (req, res) => {
    res.render('foods/new.ejs');
});

// Create route: Handle form submission to create a new food item
router.post('/', async (req, res) => {
    req.body.user_id = req.session.user._id; // Set the user ID from session
    await foods.create(req.body);
    res.redirect('/foods'); // Redirect to the food index
  });


module.exports = router;

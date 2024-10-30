const express = require('express');
const router = express.Router();

const Food = require('../models/foods');

//http://localhost:3000/foods
// Index route: Get all foods items
router.get('/', async (req, res) => {
    try {
      const foodItems = await Food.find({}).populate('user_id'); // Populate the user info
     console.log('Foods Items:', foodItems);
      res.render('foods/index.ejs', {
        foodItems,
      });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
});

//http://localhost:3000/foods/new
// New route: Render form to create a new foods item
router.get('/new', (req, res) => {
    res.render('foods/new.ejs');
});

// Create route: Handle form submission to create a new food item
router.post('/', async (req, res) => {
    req.body.user_id = req.session.user._id; // Set the user ID from session
  //console.log(req.body)
    await Food.create(req.body);
    res.redirect('/foods'); // Redirect to the food index
  });

// Show route: Get a specific food item by ID
router.get('/:foodId', async (req, res) => {
    try {
      const foodItem = await Food.findById(req.params.foodId).populate('user_id');     
      res.render('foods/show.ejs', {
        foodItem,
      });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  });  

  // DELETE route: Remove a food item
router.delete('/:foodId', async (req, res) => {
  try {
      const foodItem = await Food.findById(req.params.foodId);
      
      // Check if the user is the owner of the food item
      if (foodItem.user_id.equals(req.session.user._id)) {
          await foodItem.deleteOne();
          res.redirect('/foods'); // Redirect to the index page
      } else {
          res.send("You don't have permission to delete this item.");
      }
  } catch (error) {
      console.error(error);
      res.redirect('/');
  }
});

// EDIT route: Render form to edit a food item
router.get('/:foodId/edit', async (req, res) => {
  try {
      const foodItem = await Food.findById(req.params.foodId);
      res.render('foods/edit.ejs', { 
        foodItem 
      });

  } catch (error) {
      console.error(error);
      res.redirect('/foods');
  }
});

// UPDATE route: Handle the edit form submission
router.put('/:foodId', async (req, res) => {
  try {
      const foodItem = await Food.findById(req.params.foodId);
      if (foodItem.user_id.equals(req.session.user._id)) {
          await foodItem.updateOne(req.body);
          res.redirect('/foods');
      } else {
          res.send("You don't have permission to update this item.");
      }
  } catch (error) {
      console.error(error);
      res.redirect('/foods');
  }
});

// Rate route: Handle rating submissions
router.post('/:foodId/rate', async (req, res) => {
  try {
      const { rating } = req.body;
      const foodItem = await Food.findById(req.params.foodId);

      // Check if the user already rated this item
      const existingRatingIndex = foodItem.ratings.findIndex(r => r.user_id.equals(req.session.user._id));

      if (existingRatingIndex > -1) {
          // Update existing rating
          foodItem.ratings[existingRatingIndex].rating = rating;
      } else {
          // Add new rating
          foodItem.ratings.push({ user_id: req.session.user._id, rating });
      }

      await foodItem.save();
      res.redirect(`/foods/${foodItem._id}`); // Redirect to the food item's show page
  } catch (error) {
      console.error(error);
      res.redirect('/');
  }
});

// DELETE route: Remove a rating
router.delete('/:foodId/rate/:ratingId', async (req, res) => {
  try {
      const foodItem = await Food.findById(req.params.foodId);
      foodItem.ratings = foodItem.ratings.filter(r => !r._id.equals(req.params.ratingId)); // Remove the rating
      await foodItem.save();
      res.redirect(`/foods/${foodItem._id}`); // Redirect to the food item's show page
  } catch (error) {
      console.error(error);
      res.redirect('/');
  }
});


module.exports = router;
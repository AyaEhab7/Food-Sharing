const express = require('express');
const router = express.Router();
const foods = require('../models/foods.js');


router.get('/profile', async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.session.user) {
            return res.redirect('/auth/sign-in'); // Redirect if not logged in
        }

        // Find food items created by the logged-in user
        const foodItems = await foods.find({}).populate('user_id');

        console.log('My Food Items:', foodItems);
        res.render('profile.ejs', {
            user: req.session.user,
            foodItems, // Pass the user's food items to the view
        });
    } catch (error) {
        console.error(error);
        res.redirect('/'); 
    }
});
module.exports = router;
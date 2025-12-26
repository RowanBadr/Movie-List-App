const express = require('express');
const router = express.Router();
const movieController = require('./controllers/movieController');
const userController = require('./controllers/userController');
const passport = require('passport');

// Home route
router.get('/', (req, res) => res.render('home'));

// Movie routes
router.get('/movies', movieController.getAllMovies);
router.get('/movies/:id', movieController.getMovieById);
router.post('/movies', movieController.createMovie);
router.put('/movies/:id', movieController.updateMovie);
router.delete('/movies/:id', movieController.deleteMovie);

// User authentication routes
router.get('/register', userController.getRegister);
router.post('/register', userController.postRegister);
router.get('/login', userController.getLogin);
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));
router.get('/profile', isLoggedIn, userController.getProfile);
router.get('/logout', userController.logout);

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
module.exports = router;





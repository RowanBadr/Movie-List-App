const passport = require('passport');
const User = require('../models/User');
const { createSoapClient } = require('../soapService');

const userController = {
    getRegister: (req, res) => {
        res.render('register');
    },

    postRegister: async (req, res) => {
        try {
            const { username, password } = req.body;
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.render('register', { error: 'Username already exists' });
            }
            const newUser = new User({ username, password });
            await newUser.save();

            
            const client = await createSoapClient();
            await client.createUser({ username, password });

            req.login(newUser, err => {
                if (err) {
                    console.error('Error logging in after registration:', err);
                    return res.render('error');
                }
                res.redirect('/');
            });
        } catch (err) {
            console.error('Error registering user:', err);
            res.render('error');
        }
    },

    getLogin: (req, res) => {
        res.render('login');
    },

    postLogin: passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true 
    }),

    getProfile: (req, res) => {
        res.render('profile', { user: req.user });
    },

    logout: (req, res) => {
        req.logout();
        res.redirect('/');
    }
};

module.exports = userController;





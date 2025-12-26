const Movie = require('../models/Movie');
const { createSoapClient } = require('../soapService');

const movieController = {
    getAllMovies: async (req, res) => {
        try {
            const movies = await Movie.find();
            res.render('movies', { movies });
        } catch (err) {
            console.error('Error getting movies:', err);
            res.render('error');
        }
    },

    getMovieById: async (req, res) => {
        try {
            const movie = await Movie.findById(req.params.id);
            if (!movie) {
                res.status(404).send('Movie not found');
            } else {
                res.render('movieDetail', { movie });
            }
        } catch (err) {
            console.error('Error getting movie by ID:', err);
            res.render('error');
        }
    },

    createMovie: async (req, res) => {
        try {
            const { title, description, genre } = req.body;
            const newMovie = new Movie({ title, description, genre });
            await newMovie.save();

            
            const client = await createSoapClient();
            await client.createMovie({ title, description, genre });

            res.redirect('/movies');
        } catch (err) {
            console.error('Error creating movie:', err);
            res.render('error');
        }
    },

    updateMovie: async (req, res) => {
        try {
            const { title, description, genre } = req.body;
            await Movie.findByIdAndUpdate(req.params.id, { title, description, genre });

            
            const client = await createSoapClient();
            await client.updateMovie(req.params.id, { title, description, genre });

            res.redirect('/movies');
        } catch (err) {
            console.error('Error updating movie:', err);
            res.render('error');
        }
    },

    deleteMovie: async (req, res) => {
        try {
            await Movie.findByIdAndDelete(req.params.id);

           
            const client = await createSoapClient();
            await client.deleteMovie(req.params.id);

            res.redirect('/movies');
        } catch (err) {
            console.error('Error deleting movie:', err);
            res.render('error');
        }
    }
};

module.exports = movieController;



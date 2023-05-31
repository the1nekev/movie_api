const express = require("express"),     
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    uuid = require("uuid"),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const moongose = require('mongoose');
const Models = require('./models.js');

app.use(morgan('common'));
app.use(express.static('public'));

const Movies = Models.Movie;
const Users = Models.User;

moongose.connect('mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js')



//Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error occurred!');
})


//Default text message 
app.get('/', (req, res) => {
    res.send("Welcome to my Flix API!");
});

//GET all movies in JSON format
app.get('/movies', passport.authenticate('jwt', {session: false}),
(req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ (Get all Users)
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: '+ err)
        });
});

//READ (Get user by Username)
app.get('/users/:Username', (req, res) => {
    Users.findOne({Username: req.params.Username})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        });
});

//READ return movie data by title
app.get('/movies/:Title' , (req,res) => {
    Movies.findOne({ Title: req.params.Title})
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        res.status(500).send('Error: ' + err);
    });
});

//READ return genre data by name
app.get('/movies/Genre/:Name', (req, res) => {
    Movies.findOne({'Genre.Name': req.params.Name})
    .then((movie) => {
        if (!movie) {
            return res.status(404).send('Error: ' + req.params.Name + ' was not found. ): ');
        } else{
            res.status(200).json(movie.Genre.Description);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ return director data by name
app.get('/movies/Director/:Name', (req, res) => {
    Movies.findOne({'Director.Name': req.params.Name})
    .then((movie) => {
        if (!movie) {
            return res.status(404).send('Error: ' + req.params.Name + ' was not found. ): ');
        } else{
            res.status(200).json(movie.Director);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//CREATE Request (Allow new users to register)
app.post('/users', (req, res) => {
    Users.findOne({Username: req.body.Username}).then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                })
                .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//UPDATE User's info by Username
app.put('/users/:Username', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$set: {
				Username: req.body.Username,
				Password: req.body.Password,
				Email: req.body.Email,
				Birthday: req.body.Birthday,
			},
		},
		{ new: true }
	)
		.then((user) => {
			if (!user) {
				return res.status(404).send('Error: No user was found');
			} else {
				res.json(user);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//UPDATE add movie to user's FavoriteMovies' list
app.post('/users/:Username/movies/:MovieID', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$addToSet: { FavoriteMovies: req.params.MovieID },
		},
		{ new: true }
	)
		.then((updatedUser) => {
			if (!updatedUser) {
				return res.status(404).send('Error: User was not found');
			} else {
				res.json(updatedUser);
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

//DELETE (Remove movie from user array)
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$pull: { FavoriteMovies: req.params.MovieID },
		},
		{ new: true }
	)
		.then((updatedUser) => {
			if (!updatedUser) {
				return res.status(404).send('Error: User was not found');
			} else {
				res.json(updatedUser);
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

//DELETE User
app.delete('/users/:Username',  (req, res) => {
    Users.findOneAndRemove({Username: req.params.Username})
    .then((deletedUser) => {
        if (!deletedUser) {
            res.status(404).send('Error: No such user exists!');
        } else{ 
            res.send('User: ' + req.params.Username + ' has been removed.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
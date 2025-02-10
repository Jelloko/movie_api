//dependencies

require('dotenv').config();  // <-- Add this line to load environment variables from .env file

const express = require('express'),
 bodyParser = require('body-parser'),
 uuid = require('uuid'),
 bcrypt = require('bcrypt'),
 mongoose = require('mongoose'),
 Models = require('./models.js'),
 morgan = require('morgan');

 const { check, validationResult } = require('express-validator');

 /**
 * Express application instance.
 * @constant {object}
 */
 const app = express();

 /**
 * Mongoose models.
 * @constant {object}
 */
 const Movies = Models.movies;
 const Users = Models.users;
 const Genres = Models.Genre;
 const Directors = Models.Director;

 //mongoose.connect('mongodb://localhost:27017/dbflix');
 /**
 * Database connection.
 */
 mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  const cors = require('cors');
  app.use(cors());

  let auth = require('./auth')(app);

  const passport = require('passport');
  require('./passport');
  
  app.use(morgan('common'));

  app.use(express.static('public'));

/**
 * Root route.
 * @route GET /
 * @returns {string} Welcome message.
 */
// get 
  app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
  });
  

  /**
 * Get all movies.
 * @route GET /movies
 * @returns {object[]} List of movies.
 * @async
 */
  app.get('/movies',passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  

  /**
 * Get a movie by title.
 * @route GET /movies/:Title
 * @param {string} Title - Movie title.
 * @returns {object} Movie details.
 * @async
 */
  app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


  /**
 * Get genre by name.
 * @route GET /movies/Genre/:genreName
 * @param {string} genreName - Genre name.
 * @returns {object} Genre details.
 * @async
 */
  app.get('/movies/Genre/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then((movies) => {
        res.json(movies.Genre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


 /**
 * Get director by name.
 * @route GET /movies/Director/:directorName
 * @param {string} directorName - Director name.
 * @returns {object} Director details.
 * @async
 */
  app.get('/movies/Director/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ 'Director.Name': req.params.directorName })
      .then((movies) => {
        res.json(movies.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


 /**
 * Get all users.
 * @route GET /users
 * @returns {object[]} List of users.
 * @async
 */
  app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


  /**
 * Get user by name.
 * @route GET /users/:Name
 * @param {string} Name - User name.
 * @returns {object} User details.
 * @async
 */
  app.get('/users/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Name: req.params.Name })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


/**
 * Register a new user.
 * @route POST /users
 * @param {object} req.body - User data.
 * @returns {object} New user details.
 * @async
 */
app.post('/users', check('Name', 'Name is required').isLength({min: 5}),
check('Name', 'Name contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
, async (req, res) => {
  let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

  let hashedPassword = Users.hashPassword(req.body.Password);
  await Users.findOne({ Name: req.body.Name })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Name + 'already exists');
      } else {
        Users
          .create({
            Name: req.body.Name,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
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

/**
 * Delete a user by name.
 * @route DELETE /users/:Name
 * @param {string} Name - User name.
 * @returns {string} Confirmation message.
 * @async
 */
app.delete('/users/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndDelete({ Name: req.params.Name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Name + ' was not found');
      } else {
        res.status(200).send(req.params.Name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


/**
 * Remove a movie from a user's list of favorite movies.
 * @route DELETE /users/:Name/FavoriteMovies/:moviesID
 * @param {string} Name - The username of the user.
 * @param {string} moviesID - The ID of the movie to remove from the favorites list.
 * @returns {object} The updated user object.
 * @async
 */
app.delete('/users/:Name/FavoriteMovies/:moviesID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Name: req.params.Name }, { $pull:
    { FavoriteMovies: req.params.moviesID }
  },
  { new: true }) 
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  })

});


/**
 * Update a user's details.
 * @route PUT /users/:Name
 * @param {string} Name - The username of the user to update.
 * @param {string} Password - The new password for the user.
 * @param {string} Email - The new email for the user.
 * @param {string} Birthday - The new birthday for the user.
 * @returns {object} The updated user object.
 * @async
 */
// put
app.put('/users/:Name', passport.authenticate('jwt', { session: false }), check('Name', 'Name is required').isLength({min: 5}),
check('Name', 'Name contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()
, async (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  if(req.user.Name !== req.params.Name){
    return res.status(400).send('Permission denied');
  }

  await Users.findOneAndUpdate({ Name: req.params.Name }, { $set:
    {
      Name: req.body.Name,
      Password: Users.hashPassword(req.body.Password),
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }) 
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  })

});


/**
 * Update a user's favorite movies.
 * @route PUT /users/:Name/FavoriteMovies/:moviesID
 * @param {string} Name - User name.
 * @param {string} moviesID - Movie ID.
 * @returns {object} Updated user details.
 * @async
 */
app.put('/users/:Name/FavoriteMovies/:moviesID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Name: req.params.Name }, { $push:
    { FavoriteMovies: req.params.moviesID }
  },
  { new: true }) 
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  })

});

/**
 * Start the server.
 * @constant {number} port - Server port.
 */
//port
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
const express = require('express'),
 bodyParser = require('body-parser'),
 uuid = require('uuid'),
 bcrypt = require('bcrypt'),
 mongoose = require('mongoose'),
 Models = require('./models.js'),
 morgan = require('morgan');

 const { check, validationResult } = require('express-validator');

 const app = express();
 const Movies = Models.movies;
 const Users = Models.users;
 const Genres = Models.Genre;
 const Directors = Models.Director;

 mongoose.connect('mongodb://localhost:27017/dbflix');

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({ extended: true }));

  const cors = require('cors');
  app.use(cors());

  let auth = require('./auth')(app);

  const passport = require('passport');
  require('./passport');
  
  app.use(morgan('common'));

  app.use(express.static('public'));

// get 
  app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
  });
  
  app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
  
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

//post
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

// delete
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

app.delete('/users/:Name/FavoriteMovies/:moviesID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Name: req.params.Name }, { $pull:
    { FavoriteMovies: req.params.moviesID }
  },
  { new: true }) 
  .then((updatedUser) => {
    res.json(req.params.moviesID + ' was removed ');
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  })

});

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

app.put('/users/:Name/FavoriteMovies/:moviesID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Users.findOneAndUpdate({ Name: req.params.Name }, { $push:
    { FavoriteMovies: req.params.moviesID }
  },
  { new: true }) 
  .then((updatedUser) => {
    res.json(req.params.moviesID + ' was added ');
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  })

});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
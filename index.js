const express = require('express'),
 bodyParser = require('body-parser'),
 uuid = require('uuid'),
 morgan = require('morgan');

 const app = express();

let users = [
  {
  id: 20,
  name:"Jesse",
  lists: {
  userName: "Jello",
  }
},
{
  id: 21,
  name:"Josh",
  lists: {
  userName: "Tater",
  }
},
{
  id: 22,
  name:"Jordan",
  lists: {
  userName: "Taffys",
  }
},
]

let topMovies = [
    {
      id: 1,
      title: 'The Shawshank Redemption',
      director: 'Frank Darabont',
      genre: 'Drama'
    },
    {
      id: 2,
      title: 'Godzilla Minus One',
      director: 'Takashi Yamazaki',
      genre: 'Kaiju',
    },
    {
      id: 3,
      title: 'The Lord of the Rings: The Return of the King',
      director: 'Peter Jackson',
      genre: 'Fantasy',
    },
    {
      id: 4,
      title: 'Saving Private Ryan',
      director: 'Steven Spielberg',
      genre: 'War film',
    },
    {
      id: 5,
      title: 'Jaws',
      director: 'Steven Spielberg',
      genre: 'Thriller',
    },
    {
      id: 6,
      title: '12 Angry Men',
      director: 'Sidney Lumet',
      genre: 'Drama',
    },
    {
      id: 7,
      title: 'The Dark Knight',
      director: 'Christopher Nolan',
      genre: 'Action',
    },
    {
      id: 8,
      title: 'Inception',
      director: 'Christopher Nolan',
      genre: 'Action',
    },
    {
      id: 9,
      title: 'Fight Club',
      director: 'David Fincher',
      genre: 'Thriller',
    },
    {
      id: 10,
      title: 'Scary Movie',
      director: 'Keenen Ivory Wayans',
      genre: 'Comedy',
    }
  ];

  app.use(bodyParser.json());
  
  app.use(morgan('common'));

  app.use(express.static('public'));

// get 
  app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
  });
  
  app.get('/topMovies', (req, res) => {
    res.json(topMovies);
  });
  
  app.get('/topMovies/:title', (req, res) => {
  res.json(topMovies.find((movie) =>
    { return movie.title === req.params.title}));
  });

//post
  app.post('/users', (req, res) => {
    let newUser = req.body;
  
    if (!newUser.name) {
      const message = 'Missing user name';
      res.status(400).send(message);
    } else {
      newUser.id = uuid.v4();
      users.push(newUser);
      res.status(201).send(newUser);
    }
  });

// delete

app.delete('/users/:name', (req, res) => {
  let Uzr = users.find((Uzr) => { return Uzr.name === req.params.name });

  if (Uzr) {
    users = users.filter((obj) => { return obj.name !== req.params.name });
    res.status(201).send(' User ' + req.params.name + ' was deleted. ');
  }
});

// put

app.put('/users/:name/:list/:userName', (req, res) => {
  let Uzr = users.find((Uzr) => { return Uzr.name === req.params.name });

  if (Uzr) {
    Uzr.lists[req.params.list] = parseInt(req.params.userName);
    res.status(201).send(' User ' + req.params.name + ' had their Username changed to ' + req.params.userName);
  } else {
    res.status(404).send(' User with the name ' + req.params.name + ' was not found ');
  }
});

  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
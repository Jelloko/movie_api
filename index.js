const express = require('express'),
 morgan = require('morgan');

const app = express();


let topMovies = [
    {
      title: 'The Shawshank Redemption',
      director: 'Frank Darabont'
    },
    {
      title: 'Godzilla Minus One',
      director: 'Takashi Yamazaki'
    },
    {
      title: 'The Lord of the Rings: The Return of the King',
      director: 'Peter Jackson'
    },
    {
      title: 'Saving Private Ryan',
      director: 'Steven Spielberg'
    },
    {
      title: 'Good Will Hunting',
      director: 'Gus Van Sant'
    },
    {
      title: 'Gladiator',
      director: 'Ridley Scott'
    },
    {
      title: 'The Dark Knight',
      director: 'Christopher Nolan'
    },
    {
      title: 'Forrest Gump',
      director: 'Robert Zemeckis'
    },
    {
      title: 'Fight Club',
      director: 'David Fincher'
    },
    {
      title: 'Scary Movie',
      director: 'Keenen Ivory Wayans'
    }
  ];
  
  app.use(morgan('common'));

  app.use(express.static('public'));

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error!');
  });


  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
  });
  
  app.get('/movies', (req, res) => {
    res.json(topMovies);
  });
  
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
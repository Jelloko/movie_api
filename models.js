mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
      Name: String,
      Description: String
    },
    Director: {
      Name: String,
      Bio: String
    }
  });
  
  let userSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movies' }]
  });
  
  let movies = mongoose.model('Movies', movieSchema);
  let users = mongoose.model('Users', userSchema);
  
  module.exports.movies = movies;
  module.exports.users = users;

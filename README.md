# Movie API

This is a RESTful API for managing a movie database. It allows users to interact with movies, genres, directors, and user profiles. Users can register, log in, update their profiles, and manage their favorite movies.

## Features

- **Movies**: Retrieve all movies or find movies by title, genre, or director.
- **Genres & Directors**: Get information about genres and directors.
- **User Management**: Register, login, and manage user profiles (name, email, password, birthday).
- **Favorite Movies**: Add or remove movies from a user's list of favorite movies.

## Technologies Used

- Node.js
- Express.js
- MongoDB (via Mongoose)
- Passport.js (JWT authentication)
- bcrypt (password hashing)
- Express-validator (input validation)
- morgan (HTTP request logging)
- CORS (cross-origin resource sharing)

## Endpoints

### Movies

- **GET /movies**  
  Retrieves a list of all movies.

- **GET /movies/:Title**  
  Retrieves details of a movie by its title.

- **GET /movies/Genre/:genreName**  
  Retrieves movies of a specific genre.

- **GET /movies/Director/:directorName**  
  Retrieves movies by a specific director.

### Users

- **GET /users**  
  Retrieves a list of all users.

- **GET /users/:Name**  
  Retrieves user details by username.

- **POST /users**  
  Registers a new user with a name, email, password, and birthday.

- **DELETE /users/:Name**  
  Deletes a user by username.

- **DELETE /users/:Name/FavoriteMovies/:moviesID**  
  Removes a movie from a user's list of favorite movies.

- **PUT /users/:Name**  
  Updates a user's details (name, password, email, birthday).

- **PUT /users/:Name/FavoriteMovies/:moviesID**  
  Adds a movie to a user's list of favorite movies.

### Authentication

The API uses JWT for authentication. Users must be authenticated to access most endpoints. To authenticate, use the `POST /login` endpoint (implementation not shown in the provided code).

### Input Validation

The API uses `express-validator` to validate input data for creating or updating users. Errors in validation will return a 422 status with the validation error details.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/movie-api.git
   cd movie-api

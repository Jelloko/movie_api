/**
 * @constant {string} jwtSecret - Secret key used for signing JWT tokens.
 */
const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Passport configuration file

/**
 * Generates a JWT token for the provided user.
 * 
 * @param {Object} user - The user object to be encoded in the token.
 * @param {string} user.Name - The name of the user, used as the token subject.
 * @returns {string} The generated JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Name, // Subject of the token
    expiresIn: '7d', // Token expiration time
    algorithm: 'HS256' // Algorithm used to sign the token
  });
};

/**
 * Configures the login endpoint.
 * 
 * @param {Object} router - The Express router instance.
 * @async
 */
module.exports = (router) => {
  /**
   * POST login endpoint.
   * 
   * @name POST /login
   * @function
   * @param {Object} req - Express request object.
   * @param {Object} req.body - The body of the request, containing user credentials.
   * @param {Object} res - Express response object.
   * @returns {Object} JSON object containing the user and the JWT token.
   */
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is wrong',
          user: user
        });
      }

      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};

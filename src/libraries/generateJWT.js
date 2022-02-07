/** Third party dependencies */
const _ = require('lodash');

const jwt = require('jsonwebtoken');


/** Local static exports & configuration */
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');


/**
 * Generate a signed token
 * @param {(Object|string)} data Object or string to hash
 * @return {Promise} A promise that resolves to the hashed string
 */
const signAndReturnJWT = (data) => {
  
    return jwt.sign(
        data,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
    
};

module.exports = { signAndReturnJWT };

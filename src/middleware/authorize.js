const jwt = require('jsonwebtoken');
const config = require('../../config');

const { JWT_SECRET } = config;

const { NotAllowedError } = require('../errors');

// This is the middleware in charge of handling roles, it recieves an array of roles,
// and will be verified with the jsonwebtoken, if successful, it will continue on to the api
// endpoint. If not, it will give a 403 forbidden error
function authorize(args = []) {
  let roles = args;

  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      const { token } = req;
      const { sub, role, id } = jwt.verify(token, JWT_SECRET);
      // If there are roles and is included in the role that the json web token gave us
      if (roles.length && !roles.includes(role)) {
        throw new NotAllowedError('Insufficient Permissions');
      }

      req.sub = sub;

      req.role = role;

      req.id = id;

      next();
    } catch (error) {
      if (error instanceof NotAllowedError) {
        res.status(403).json({
          error: error.message,
        });
      } else {
        res.status(400).json({
          error: error.message,
        });
      }
    }
  };
}

module.exports = authorize;

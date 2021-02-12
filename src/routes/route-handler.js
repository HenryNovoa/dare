const {
  AuthError, NotFoundError, ValueError, NotAllowedError,
} = require('../errors');

// This is a handler for controlling the errors that a given endpoint can give.
// Is is a promise wrapped around a try/catch to be able to capture sincronous errors as well.
function routeHandler(callback, res) {
  try {
    callback()
      .catch((err) => {
        const { message, extra } = err;

        if (err instanceof AuthError || err instanceof NotAllowedError) {
          res.status(401);
        } else if (err instanceof NotFoundError) {
          res.status(404);
        } else {
          res.status(500);
        }

        res.json({
          code: res.statusCode,
          error: message,
          data: extra,
        });
      });
  } catch (err) {
    const { message } = err;

    if (err instanceof TypeError || err instanceof ValueError) {
      res.status(400);
    } else {
      res.status(500);
    }

    res.json({
      code: res.statusCode,
      error: message,
    });
  }
}

module.exports = routeHandler;

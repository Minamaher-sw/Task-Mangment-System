/**
 * Wraps async route handlers to catch errors and pass them to Express error handler.
 */
const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

export default asyncWrapper;

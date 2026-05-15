// middleware/errorHandler.js
const ExpressError = require('../utils/ExpressError');

const handleValidationError = (err) => {
    const messages = Object.values(err.errors).map(el => el.message);
    return new ExpressError(messages.join(', '), 400);
};

const handleCastError = (err) => {
    return new ExpressError('Invalid ID format', 400);
};

const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    return new ExpressError(`${field.charAt(0).toUpperCase() + field.slice(1)} already exists`, 400);
};

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;

    // Log error for development
    console.error('ERROR:', err);

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        error = handleValidationError(err);
    }

    // Mongoose CastError
    if (err.name === 'CastError') {
        error = handleCastError(err);
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        error = handleDuplicateKeyError(err);
    }

    // Handle 404 errors
    if (error.statusCode === 404) {
        return res.status(404).render('error', {
            error: {
                statusCode: 404,
                message: error.message || 'Page Not Found'
            }
        });
    }

    res.status(error.statusCode).render('error', {
        error: {
            statusCode: error.statusCode,
            message: error.message || 'Something went wrong!'
        }
    });
};

module.exports = errorHandler;
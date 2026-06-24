const errorHandler = (err, req, res, next) => {
    console.error("System Error: ", err.message || err);
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal Error'

    res.status(statusCode).json({error: errorMessage});
}

module.exports = errorHandler
const jwt = require('jsonwebtoken');

const protectRoute = async (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error('Not authorized to access this route, token missing');
            err.statusCode = 401; 
            return next(err);
        }

        const token = authHeader.split(' ')[1];

        const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

        req.dispatcherId = decodedPayload.id;

        next();

    } catch (error) {
        const err = new Error('Token verification failed, access denied');
        err.statusCode = 401;
        next(err);
    }
};

module.exports = protectRoute;
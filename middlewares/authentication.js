const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
    const token = req.header('auth-token');
    if(!token) {
        res.json({
            message: `You are not logged in`
        });
        return;
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    req.User = {
        user: decode.username,
        auth: decode.authorization
    };
    next();
};
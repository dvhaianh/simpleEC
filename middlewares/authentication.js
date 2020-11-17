const jwt = require('jsonwebtoken');

/**
 * Kiểm tra đăng nhập.
 */
module.exports.guest = async (req, res, next) => {
    const token = req.session.token;
    if(!token) {
        req.user = {
            auth: 'guest'
        };
    }
    else {
        const decode = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            user: decode.username,
            auth: decode.authorization
        };
    }
    next();
};

/**
 * Kiểm tra quyền người dùng.
 */
module.exports.user = async (req, res, next) => {
    const token = req.session.token;
    if(!token) {
        res.redirect('/login');
        return;
    }
    next();
}

/**
 * Kiểm tra quyền admin.
 */
module.exports.admin = async (req, res, next) => {
    const token = req.session.token;
    if(!token) {
        res.redirect('/login');
        return;
    }
    if(req.user.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    next();
};
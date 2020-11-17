const mongoose = require('mongoose');

/**
 * Schema:
 *      username:       Tên đăng nhập.
 *      password:       Mật khẩu (mã hóa).
 *      decode:         Chuỗi giải mã mật khẩu.
 *      fullname:       Tên người dùng.
 *      email:          Email người dùng.
 *      authorization:  Quyền truy cập vào hệ thống.
 *      created:        Ngày tạo tài khoản.
 */
const ACCOUNT = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        index: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    decode: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        require: true,
        index: true
    },
    authorization: {
        type: String,
        required: true,
        default: 'user'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

const accs = mongoose.model('accounts', ACCOUNT, 'accounts');

/**
 * Liệt kê tất cả tài khoản.
 */
module.exports.listing = () => {
    return accs.find()
        .sort("username")
        .then(doc => {
            return doc;
        });
};

/**
 * Tìm kiếm tài khoản.
 * @param {String} input Thông tin tài khoản muốn tìm (tên đăng nhập, tên người dùng, email).
 */
module.exports.finding = input => {
    return accs
        .find({
            $or: [
                { username: input },
                { email: input },
                { fullname: input }
            ]
        })
        .then(doc => {
            if (doc.length > 0) return doc;
        });
};

/**.
 * Xem tài khoản
 * @param {String} username Tên đăng nhập.
 */
module.exports.reading = username => {
    return accs.findOne({ username })
        .then(doc => {
            return doc;
        });
};

/**
 * Thêm tài khoản mới.
 * @param {Object} acc Các thông tin về tài khoản thêm mới.
 */
module.exports.register = acc => {
    const newAcc = new accs({
        username: acc.username,
        password: acc.password,
        decode: acc.decode,
        fullname: acc.fullname,
        email: acc.email,
    });
    newAcc.save();
    return acc;
}

/**
 * Thay đổi thông tin tài khoản.
 * @param {String} username Tên đăng nhập.
 * @param {Object} input Thông tin thay đổi.
 */
module.exports.changeInfo = (username, input) => {
    accs.findOneAndUpdate(
        { username },
        {
            fullname: input.fullname,
            email: input.email
        })
        .exec();
}

/**
 * Đổi mật khẩu.
 * @param {String} username Tên đăng nhập.
 * @param {String} password Mật khẩu mới (mã hóa).
 * @param {String} decode Chuỗi mã hóa mới.
 */
module.exports.changePwd = (username, password, decode) => {
    accs.findOneAndUpdate(
        { username },
        { password, decode })
        .exec();
};

/**
 * Xóa tài khoản.
 * @param {String} username Tên đăng nhập.
 */
module.exports.deleteAcc = username => {
    accs.findOneAndDelete({ username })
        .exec();
}
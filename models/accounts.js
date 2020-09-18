const mongoose = require('mongoose');

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

//List
module.exports.listing = () => {
    return accs.find()
        .sort("username")
        .then(doc => {
            return doc;
        });
}

//Find
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
}

module.exports.reading = username => {
    return accs.findOne({ username })
        .then(doc => {
            return doc;
        });
}

//Add
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

//Edit
module.exports.changeInfo = (username, input) => {
    accs.findOneAndUpdate(
        { username },
        {
            fullname: input.fullname,
            email: input.email
        })
        .exec();
}

module.exports.changePwd = (username, password, decode) => {
    accs.findOneAndUpdate(
        { username },
        { password, decode })
        .exec();
};

//Delete
module.exports.deleteAcc = username => {
    accs.findOneAndDelete({ username })
        .exec();
}
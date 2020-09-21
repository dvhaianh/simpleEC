const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const accs = require('../models/accounts');
const orders = require('../models/orders');

module.exports.register = async (req, res) => {
    const decode = await bcrypt.genSalt(13);
    const acc = {
        username: req.body.username,
        password: await bcrypt.hash(
            req.body.password,
            decode,
        ),
        decode,
        fullname: req.body.fullname,
        email: req.body.email
    }
    try {
        //Check account
        if (await accs.finding(acc.username)) {
            res.json({
                message: `Username is existed`
            });
            return;
        }
        //Check email
        if (await accs.finding(acc.email)) {
            res.json({
                message: `Email is existed`
            });
            return;
        }
        const account = await accs.register(acc);
        res.redirect('/login');
        return;
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK

module.exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const account = await accs.finding(username);
        //Check account
        if (!account) {
            res.json({
                message: `Username is not availabe`
            });
            return;
        }
        else {
            const pwd = account[0].password,
                decode = account[0].decode,
                authorization = account[0].authorization;
            //Check password
            if (pwd !== await bcrypt.hash(
                password,
                decode
            )) {
                res.json({
                    message: `Password is wronged`
                });
                return;
            }
            else {
                //Sign token
                const token = jwt.sign({
                    username,
                    authorization
                }, process.env.JWT_SECRET);
                //token -> session
                req.session.token = token;
                req.User = {
                    user: username,
                    auth: authorization
                };
                //Render admin || user
                res.redirect('/');
                return;
            }
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK

module.exports.changeInfor = async (req, res) => {
    const username = req.user.user;
    const { fullname, email } = req.body;
    try {
        const old = await accs.finding(username);
        if (old) {
            if (email !== old[0].email && await accs.finding(email)) {
                res.json({
                    message: `Email is exitsed`
                });
                return;
            } else {
                await accs.changeInfo(username, { fullname, email });
                const acc = await accs.finding(username);
                res.redirect('/users/information?username=' + username);
                return;
            }
        } else {
            res.json({
                message: `Account is not existed`
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK

module.exports.changePwd = async (req, res) => {
    const username = req.user.user;
    const { currentPassword, newPassword } = req.body;
    try {
        const old = await accs.finding(username);
        if (old) {
            let pwd = old[0].password,
                decode = old[0].decode;
            if (pwd !== await bcrypt.hash(
                currentPassword,
                decode)
            ) {
                res.json({
                    message: `Current password is wronged`
                });
                return;
            } else {
                decode = await bcrypt.genSalt(13);
                pwd = await bcrypt.hash(
                    newPassword,
                    decode
                );
                await accs.changePwd(username, pwd, decode);
                res.json({
                    message: `Success`
                });
                return;
            }
        } else {
            res.json({
                message: `Account is not existed`
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK

module.exports.listing = async (req, res) => {
    try {
        const listAcc = await accs.listing();
        res.render('admin/users', {
            header: "All users",
            data: listAcc
        });
        return;
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK

module.exports.finding = async (req, res) => {
    const { infor } = req.query;
    try {
        const acc = await accs.finding(infor)
        if (!acc) {
            res.json({
                message: `Information not found`
            });
            return;
        } else {
            res.render('admin/users', {
                header: "Find user",
                data: acc
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK

module.exports.reading = async (req, res) => {
    const { username } = req.query;
    try {
        const account = await accs.reading(username);
        if(req.user.auth === "admin"){
            res.render('admin/userRead', {
                data: account
            });
            return;
        } else {
            res.render('user/myAccount', {
                user: req.user,
                data: account
            });
            return;
        }
    } catch (error) {
        res.json({
            message: `${error}`
        });
        return;
    }
}   //OK

module.exports.delete = async (req, res) => {
    const { username } = req.body;
    try {
        if (await accs.finding(username)) {
            await orders.deleteUser(username);
            await accs.deleteAcc(username);
            res.redirect('/admin/users');
            return;
        } else {
            res.json({
                message: `Account is not existed`
            });
            return;
        }
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK
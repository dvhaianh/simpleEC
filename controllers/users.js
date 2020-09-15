const accs = require('../models/accounts');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.login = async (req, res) => {
    const {username, password} = req.body;
    try {
        const account = await accs.finding(username);
        if(account){
            const pwd = account[0].password,
                  decode = account[0].decode;
            if(pwd !== await bcrypt.hash(
                password,
                decode
            )){
                res.json({
                    message: `Password is wronged`
                });
                return;
            } else {
                // const token = jwt.sign({
                //     username,
                //     authorization: account[0].authorization
                // }, process.env.JWT_SECRET);
                // res.json({
                //     message: `Success`,
                //     token
                // });
                if(account[0].authorization === "admin"){
                    res.render('admin', {
                        title: "Admin"
                    });
                } else {
                    res.render('users', {
                        title: "User"
                    });
                }
                return;
            }
        } else {
            res.json({
                message: `Username is not availabe`
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
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    try {
        const listAcc = await accs.listing();
        res.json({
            message: `Success`,
            amount: listAcc.length,
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
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const {infor} = req.body;
    try {
        const acc = await accs.finding(infor)
        if(!acc){
            res.json({
                message: `Information not found`
            });
            return;
        } else {
            res.json({
                message: `Success`,
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
        if(await accs.finding(acc.username)){
            res.json({
                message: `Username is existed`
            });
            return;
        }
        if(await accs.finding(acc.email)){
            res.json({
                message: `Email is existed`
            });
            return;
        }
        const account = await accs.register(acc);
        res.json({
            message: `Success`,
            data: account
        });
        return;
    } catch (error) {
        res.json({
            error: `${error}`
        });
        return;
    }
}   //OK

module.exports.changeInfor = async (req, res) => {
    const {username} = req.params;
    if(req.User.user !== username){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const {fullname, email} = req.body;
    try {
        const old = await accs.finding(username);
        if(old){
            if(email !== old[0].email && await accs.finding(email)){
                res.json({
                    message: `Email is exitsed`
                });
                return;
            } else {
                await accs.changeInfo(username, {fullname, email});
                const acc = await accs.finding(username);
                res.json({
                    message: `Success`,
                    data: acc
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

module.exports.changePwd = async (req, res) => {
    const {username} = req.params;
    if(req.User.user !== username){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const {currentPassword, newPassword} = req.body;
    try {
        const old = await accs.finding(username);
        if(old){
            let pwd = old[0].password,
                decode = old[0].decode;
            if(pwd !== await bcrypt.hash(
                currentPassword,
                decode)
            ){
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

module.exports.delete = async (req, res) => {
    if(req.User.auth !== "admin"){
        res.json({
            message: `You are not authorized`
        });
        return;
    }
    const {username} = req.params;
    try {
        if(await accs.finding(username)){
            await accs.deleteAcc(username);
            res.json({
                message: `Success`
            });
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
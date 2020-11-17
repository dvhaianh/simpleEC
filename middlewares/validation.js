const joi = require('@hapi/joi');

/**
 * Schema.
 */
const schema = {
    register: joi.object({
        username:   joi.string()
                    .min(6)
                    .max(15)
                    .required(),
        password:   joi.string()
                    .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
                    .required(),
        fullname:   joi.string()
                    .max(100)
                    .required(),
        email:      joi.string()
                    .email()
                    .required()
    }),
    login: joi.object({
        username:   joi.string()
                    .min(6)
                    .max(15)
                    .required(),
        password:   joi.string()
                    .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
                    .required()
    }),
    product: joi.object({
        productID:  joi.string()
                    .pattern(new RegExp("^(prd)[0-9]+$"))
                    .required(),
        productName:joi.string()
                    .required(),
        price:      joi.number()
                    .required(),
        image:      joi.string()
                    .required()
    }),
    order: joi.object({
        orderdetail:joi.string()
                    .required(),
    })
};

/**
 * Kiểm tra định dạng thông tin đăng ký.
 */
module.exports.register = async (req, res, next) => {
    const value = await schema.register.validate(req.body);
    if(value.error){
        res.json({
            message: value.error.details[0].message
        });
        return;
    } else next();
};

/**
 * Kiểm tra định dạng thông tin đăng nhập.
 */
module.exports.login = async (req, res, next) => {
    const value = await schema.login.validate(req.body);
    if(value.error){
        res.json({
            message: value.error.details[0].message
        });
        return;
    } else next();
};

/**
 * Kiểm tra định dạng thông tin sản phẩm.
 */
module.exports.product = async (req, res, next) => {
    const value = await schema.product.validate(req.body);
    if(value.error){
        res.json({
            message: value.error.details[0].message
        });
        return;
    } else next();
};

/**
 * Kiểm tra định dạng thông tin đơn hàng.
 */
module.exports.order = async (req, res, next) => {
    const value = await schema.order.validate(req.body);
    if(value.error){
        res.json({
            message: value.error.details[0].message
        });
        return;
    } else next();
};
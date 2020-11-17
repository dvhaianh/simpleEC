const mongoose = require('mongoose');

/**
 * Schema:
 *      productID:      Mã sản phẩm.
 *      productName:    Tên sản phẩm.
 *      price:          Giá bán một sản phẩm.
 *      image:          Đường dẫn đến hình ảnh sản phẩm.
 */
const PRODUCT = new mongoose.Schema({
    productID: {
        type: String,
        required: true,
        index: true
    },
    productName: {
        type: String,
        required: true,
        index: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    }
});

const products = mongoose.model('products', PRODUCT, 'products');

/**
 * Liệt kê danh sách sản phẩm.
 */
module.exports.listing = () => {
    return products
        .find()
        .sort("productName")
        .then(doc => {
            return doc;
        });
};

/**
 * Tìm kiếm sản phẩm.
 * @param {String} input Thông tin sản phẩm (mã, tên sản phẩm).
 */
module.exports.finding = input => {
    return products
        .find({
            $or: [
                {productID: input},
                {productName: input}
            ]
        })
        .then(doc => {
            if(doc.length > 0) return doc;
        });
};

/**
 * Thêm sản phẩm mới.
 * @param {Object} input Thông tin về sản phẩm thêm mới.
 */
module.exports.adding = input => {
    const newProduct = new products({
        productID: input.productID,
        productName: input.productName,
        price: input.price,
        image: input.image
    });
    newProduct.save();
};

/**
 * Thay đổi thông tin sản phẩm.
 * @param {String} productID Mã sản phẩm.
 * @param {Object} infor Thông tin thay đổi.
 */
module.exports.editing = (productID, infor) => {
    products.findOneAndUpdate(
        {productID},
        {
            productName: infor.productName,
            price: infor.price,
            image: infor.image
        }
    ).exec();
};

/**
 * Xóa sản phẩm.
 * @param {String} productID 
 */
module.exports.delete = productID => {
    products.findOneAndDelete({productID}).exec();
};

/**
 * Lấy ra giá bán của sản phẩm.
 * @param {String} productID 
 */
module.exports.getPrice = productID => {
    return products.findOne({productID})
        .then(doc => {
            if(doc) return doc.price;
        });
};
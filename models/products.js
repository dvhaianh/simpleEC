const mongoose = require('mongoose');

const PRODUCT = new mongoose.Schema({
    productID: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
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

//List
module.exports.listing = () => {
    return products
        .find()
        .sort("productID")
        .then(doc => {
            return doc;
        });
}

//Find
module.exports.finding = input => {
    return products
        .find({$or: [{productID: input}, {productName: input}]})
        .then(doc => {
            if(doc.length > 0) return doc;
        });
}

//Add
module.exports.adding = input => {
    const newProduct = new products({
        productID: input.productID,
        productName: input.productName,
        price: input.price,
        image: input.image
    });
    newProduct.save();
}

//Edit
module.exports.editing = (productID, infor) => {
    products.findOneAndUpdate(
        {productID},
        {
            productName: infor.productName,
            price: infor.price,
            image: infor.image
        }
    ).exec();
}

//Delete
module.exports.delete = productID => {
    products.findOneAndDelete({productID}).exec();
}
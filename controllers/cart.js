module.exports.add = async (req, res) => {
    const productID = req.body.productID,
        quantity = parseInt(req.body.quantity),
        productName = req.body.productName,
        price = parseInt(req.body.price),
        image = req.body.image;
    if (quantity <= 0 || isNaN(quantity)) {
        res.json({
            message: `Quantity min is 1`
        });
        return;
    }
    let cart = req.session.cart;
    for (let index = 0; index < cart.length; index++) {
        if (productID === cart[index].productID) {
            cart[index].quantity += quantity;
            req.session.cart = cart;
            res.redirect('/');
            return;
        }
    }
    cart.push({
        productID,
        quantity,
        productName,
        price,
        image
    });
    req.session.cart = cart;
    res.redirect('/');
    return;
}   //OK

module.exports.remove = async (req, res) => {
    const productID = req.body.productID;
    for (let index in req.session.cart) {
        if (productID === req.session.cart[index].productID) {
            req.session.cart.splice(index, 1);
        }
    }
    res.redirect('/');
    return;
}   //OK

module.exports.edit = async (req, res) => {
    const productID = req.body.productID,
          quantity = req.body.quantity;
    if (quantity <= 0 || isNaN(quantity)) {
        res.json({
            message: `Quantity min is 1`
        });
        return;
    }
    for (let index in req.session.cart) {
        if (productID === req.session.cart[index].productID) {
            req.session.cart[index].quantity = quantity;
        }
    }
    res.redirect('/');
    return;
}
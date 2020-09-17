module.exports.add = async (req, res) => {
    const productID = req.body.productID,
        quantity = parseInt(req.body.quantity),
        productName = req.body.productName,
        price = parseInt(req.body.price),
        image = req.body.image;
    if (quantity <= 0) {
        res.json({
            message: `Quantity must be an integer`
        })
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
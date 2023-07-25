const {SoldCart, Buyer}= require('../models/sell.model');

//Get all sold carts
exports.getSoldCarts = async (req,res) => {
    try{
        const soldCarts = await SoldCart.find();
        res.status(200).json(soldCarts);
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getSoldCartById = async (req, res) =>{
    try {
        const soldCart = await SoldCart.findById(req.params.id);
        res.json(soldCart);
    }catch (error) {
        console.error('Faild to get Cart:', error.message);
        res.status(500).json({ message: 'Faild to get device'});
    }
};
exports.updateSoldCartById = async (req, res) => {
    try {
        const soldCart = await SoldCart.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(soldCart);
    } catch (error) {
        console.error('Faild to update cart:', error.message);
        res.status(500).json({ message: 'Faild to update cart'});
    }
};
exports.deleteSoldCartById = async (req, res) => {
    try {
        const soldCart = await SoldCart.findByIdAndDelete(req.params.id);
        if(!soldCart) {
            return res.statue(404).json({ message: 'Cart not found'});
        }
        res.json({ message: 'Cart deleted successfully'});
    } catch (error) {
        console.error('Failed to delete device:', error.message);
        res.status(500).json({message: 'Failed to delete cart'});
    }
};
// Sell a new cart
exports.sellCart = async(req, res) => {
    try{
        const {cartName, buyerName, phoneNumber, totalPrice, discount, pastOwing, total, paid, owing, sellerName, payType, buyerType, date,prodducts} = req.body;

        if (!cartName ||  !totalPrice || !total || !pastOwing || !paid || !owing) {
            return res.status(400).json({ message: 'Cart Name, Total Price, Paid are required'});
        }

        const newSoldCart = new SoldCart({
            cartName, 
            buyerName, 
            phoneNumber, 
            totalPrice, 
            discount,
            pastOwing, 
            total, 
            paid, 
            owing, 
            sellerName, 
            payType, 
            buyerType, 
            date,
            prodducts
        });

        const savedCart = await newSoldCart.save();

        res.status(201).json(savedCart);
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const {SoldCart,Buyer} = require('../models/sell.model');

//Get all sold carts
exports.getbuyers = async (req,res) => {
    try{
        const buyer = await Buyer.find();
        res.status(200).json(buyer);
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getbuyerById = async (req, res) =>{
    try {
        const buyer = await Buyer.findById(req.params.id);
        res.json(buyer);
    }catch (error) {
        console.error('Faild to get Cart:', error.message);
        res.status(500).json({ message: 'Faild to get Cart'});
    }
};
exports.updatebuyerById = async (req, res) => {
    try {
        const buyer = await Buyer.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(buyer);
    } catch (error) {
        console.error('Faild to update cart:', error.message);
        res.status(500).json({ message: 'Faild to update cart'});
    }
};
exports.deletebuyerById = async (req, res) => {
    try {
        const buyer = await Buyer.findByIdAndDelete(req.params.id);
        if(!buyer) {
            return res.statue(404).json({ message: 'Cart not found'});
        }
        res.json({ message: 'Cart deleted successfully'});
    } catch (error) {
        console.error('Failed to delete device:', error.message);
        res.status(500).json({message: 'Failed to delete cart'});
    }
};
// Sell a new cart
// exports.sellCart = async(req, res) => {
//     try{
//         const {cartName, buyerName, phoneNumber, totalPrice, discount, pastOwing, total, paid, owing, sellerName, payType, buyerType, date,prodducts} = req.body;

//         if (!cartName ||  !totalPrice || !total || !pastOwing || !paid || !owing) {
//             return res.status(400).json({ message: 'Cart Name, Total Price, Paid are required'});
//         }

//         const newSoldCart = new soldCart({
//             cartName, 
//             buyerName, 
//             phoneNumber, 
//             totalPrice, 
//             discount,
//             pastOwing, 
//             total, 
//             paid, 
//             owing, 
//             sellerName, 
//             payType, 
//             buyerType, 
//             date,
//             prodducts
//         });

//         const savedCart = await newSoldCart.save();

//         res.status(201).json(savedCart);
//     }catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

exports.sellCart = async (req, res) => {
  try {
    const {
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
      products,
    } = req.body;

    if (!cartName) {
        return res.status(400).json({message: 'Cart Name is required'});
    };

    if (!totalPrice) {
        return res.status(400).json({message: 'Total Price is required'});
    };

    if (!total) {
        return res.status(400).json({message: 'Total is required'});
    };

    if (!paid) {
        return res.status(400).json({ message: 'Paid is required'});
    };

    if (!owing) {
        return res.status(400).json({ message: 'Owing is required'});
    }

    let buyer = await Buyer.findOne({ buyerName });

    if (!buyer) {
      // Create a new buyer if one doesn't exist
      buyer = new Buyer({
        buyerName: buyerName,
        phoneNumber: phoneNumber,
        carts: [],
      });
    }

    const cart = new SoldCart({
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
      products,
    });

    buyer.carts.push(cart);
    await buyer.save();

    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
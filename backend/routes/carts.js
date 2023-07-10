// server/routes/cart.js
const router = require('express').Router();
const Cart = require('../models/cart');

router.post('/add-to-cart', async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // assuming you have implemented user authentication

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: []
      });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price // assuming you have a price field on the product schema
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
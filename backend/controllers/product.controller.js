const Product = require('../models/product.model');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new product
exports.createProduct = async (req, res) => {
    try {
      const { name, description, purchasePrice,quantity,quantitySold, deallerSellingPrice, deallerSellingPriceAll, userSellingPrice, category, purchasedate, sellingdate,supplier,whatIsPaid,oweing } = req.body;
  
      if (!name || !purchasePrice || !category) {
        return res.status(400).json({ message: 'Name, price, and category are required' });
      }
  
      const newProduct = new Product({
        name, 
        description, 
        purchasePrice, 
        quantity,
        quantitySold,
        deallerSellingPrice, 
        deallerSellingPriceAll, 
        userSellingPrice, 
        category,
        purchasedate, 
        sellingdate,
        supplier,
        whatIsPaid,
        oweing,
      });
  
      const savedProduct = await newProduct.save();
  
      res.status(201).json(savedProduct);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};  

// Purchase a product
exports.purchaseProducts = async (req, res) => {
  try {
    const products = req.body.products;
    const purchasedProducts = [];

    for (const item of products) {
      const productId = item.productId;
      const quantity = item.quantity;
      const product = await Product.findById(productId);
      
      if (product == null) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }

      if (product.quantity < quantity) {
        return res.status(400).json({ message: `Not enough stock for product with ID ${productId}` });
      }

      product.quantity -= quantity;
      await product.save();

      purchasedProducts.push({
        product,
        quantity
      });
    }

    res.status(200).json(purchasedProducts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// exports.searchProducts  = async (req, res) => {
//   try {
//     const { q } = req.query;
//     const products = await Product.find({ $text: { $search: q } });
//     res.json(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find();
    const hasTextIndex = products.some((product) => product._doc.hasOwnProperty('$text'));

    if (!hasTextIndex) {
      return res.status(400).json({ error: 'Text index required for $text query' });
    }

    const searchResults = await Product.find({ $text: { $search: q } });
    res.json(searchResults);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
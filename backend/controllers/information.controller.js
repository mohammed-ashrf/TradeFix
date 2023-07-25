const { Section, ProductSection,Dealer, DollarPrice, Supplier } = require('../models/information.model');

// Sections controller
async function getSections(req, res) {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getSectionById (req, res) {
  try {
    const section = await Section.findById(req.params.id);
    res.json(section);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createSection(req, res) {
  try {
    const section = new Section({
      name: req.body.name,
      description: req.body.description,
      checkingFees: req.body.checkingFees,
    });

    const savedSection = await section.save();
    res.status(201).json(savedSection);
  } catch (err) {
    console.warn(err);
    res.status(400).send(err);
  }
};

async function updateSection(req, res) {
  try {
    const section = await Section.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(section);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteSection(req, res) {
  try {
    await Section.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ProductSections controller
async function getProductSection(req, res) {
  try {
    const productSections = await ProductSection.find();
    res.json(productSections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getProductSectionById (req, res) {
  try {
    const productSections = await ProductSection.findById(req.params.id);
    res.json(productSections);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createProductSection(req, res) {
  try {
    const productSections = new ProductSection({
      name: req.body.name,
      description: req.body.description,
      checkingFees: req.body.checkingFees,
    });

    const savedProductSection = await productSections.save();
    res.status(201).json(savedProductSection);
  } catch (err) {
    console.warn(err);
    res.status(400).send(err);
  }
};

async function updateProductSection(req, res) {
  try {
    const productSections = await ProductSection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(productSections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteProductSection(req, res) {
  try {
    await ProductSection.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Suppliers controller
async function getSuppliers(req, res) {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getSupplierById (req, res) {
  try {
    const supplier = await Supplier.findById(req.params.id);
    res.json(supplier);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createSupplier(req, res) {
  try {
    const supplier = new Supplier({
      name: req.body.name,
      companyName: req.body.companyName,
      phone: req.body.phone,
      notes: req.body.notes,
    });

    const savedSupplier = await supplier.save();
    res.status(201).json(savedSupplier);
  } catch (err) {
    console.warn(err);
    res.status(400).send(err);
  }
};

async function updateSupplier(req, res) {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(supplier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteSupplier(req, res) {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Dealers controller
async function getDealers(req, res) {
  try {
    const dealers = await Dealer.find();
    res.json(dealers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getDealerById (req, res) {
  try {
    const dealer = await Dealer.findById(req.params.id);
    res.json(dealer);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createDealer(req, res) {
  try {
    const dealer = new Dealer({
      name: req.body.name,
      companyName: req.body.companyName,
      email: req.body.email,
      phone: req.body.phone,
      notes: req.body.notes,
    });
    const savedDealer = await dealer.save();
    res.status(201).json(savedDealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateDealer(req, res) {
  try {
    const dealer = await Dealer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dealer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteDealer(req, res) {
  try {
    await Dealer.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Dollar prices controller
async function getDollarPrice(req, res) {
  try {
    const dollarPrice = await DollarPrice.findOne().sort({ date: -1 });
    res.json(dollarPrice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function getDollarPriceById (req, res) {
  try {
    const dollarPrice = await DollarPrice.findById(req.params.id);
    res.json(dollarPrice);
  } catch (error) {
    console.error('Failed to get device:', error.message);
    res.status(500).json({ message: 'Failed to get device' });
  }
};

async function createDollarPrice(req, res) {
  try {
    const dollarPrice = new DollarPrice({
      price: req.body.price,
      date: req.body.date,
    });
    await dollarPrice.save();
    res.json(dollarPrice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateDollarPrice(req, res) {
  try {
    const dollarPrice = await DollarPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dollarPrice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteDollarPrice(req, res) {
  try {
    await DollarPrice.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  getProductSection,
  getProductSectionById,
  createProductSection,
  updateProductSection,
  deleteProductSection,
  getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getDealers,
  getDealerById,
  createDealer,
  updateDealer,
  deleteDealer,
  getDollarPrice,
  getDollarPriceById,
  createDollarPrice,
  updateDollarPrice,
  deleteDollarPrice,
};
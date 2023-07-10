const { Section, Dealer, DollarPrice, Supplier } = require('../models/information.model');

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

// async function createSection(req, res) {
//   try {
//     const section = new Section(req.body);
//     await section.save();
//     res.json(section);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }
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

async function createSupplier(req, res) {
  try {
    const supplier = new Supplier({
      name: req.body.name,
      phone: req.body.phone,
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

async function createDealer(req, res) {
  try {
    const dealer = new Dealer({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
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
}

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
  createSection,
  updateSection,
  deleteSection,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getDealers,
  createDealer,
  updateDealer,
  deleteDealer,
  getDollarPrice,
  createDollarPrice,
  updateDollarPrice,
  deleteDollarPrice,
};
const Store = require('../models/Store');

exports.createStore = async (req, res) => {
  const { name, description } = req.body;
  try {
    const store = new Store({
      name,
      description,
      createdBy: req.user.id,
    });
    await store.save();
    res.status(201).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find().populate('createdBy', 'email');
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
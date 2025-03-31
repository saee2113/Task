const Rating = require('../models/Rating');
const Store = require('../models/Store');

exports.submitRating = async (req, res) => {
  const { storeId, rating } = req.body;
  try {
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const existingRating = await Rating.findOne({ userId: req.user.id, storeId });
    if (existingRating) return res.status(400).json({ message: 'You already rated this store' });

    const newRating = new Rating({
      userId: req.user.id,
      storeId,
      rating,
    });
    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
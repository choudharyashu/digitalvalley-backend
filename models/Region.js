const mongoose = require('mongoose');

const regionSchema = new mongoose.Schema({
  region_id: { type: String, required: true, unique: true },
  region_name: { type: String, required: true }
});

const Region = mongoose.model('Region', regionSchema);

module.exports = Region;
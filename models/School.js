const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  school_id: { type: String, required: true, unique: true },
  school_name: { type: String, required: true },
  region_id: { type: String, required: true, ref: 'Region' }
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;

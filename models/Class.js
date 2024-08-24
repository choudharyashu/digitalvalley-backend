const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  class_id: { type: String, unique: true, required: true },
  class_name: { type: String, required: true },
  school_id: { type: String, required: true, ref: 'School' }, // Foreign key linking to School
});

module.exports = mongoose.model('Class', ClassSchema);

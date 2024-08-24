const mongoose = require('mongoose');

const BatchSchema = new mongoose.Schema({
  batch_id: { type: String, unique: true, required: true },
  batch_name: { type: String, required: true },
  class_id: { type: String, required: true, ref: 'Class' }, // Foreign key linking to Class
});

module.exports = mongoose.model('Batch', BatchSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TopicSchema = new Schema({
    topic_id: {
        type: String,
        required: true,
        unique: true
    },
    topic_name: {
        type: String,
        required: true
    },
    class_id: {
        type: String,
        required: true
    },
    no_of_sessions: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Topic', TopicSchema);

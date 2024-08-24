const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoboticsReportSchema = new Schema({
    report_id: {
        type: String,
        required: true,
        unique: true
    },
    class_id: {
        type: String,
        required: true
    },
    batch_id: {
        type: String,
        required: true
    },
    topic_id: {
        type: String,
        required: true
    },
    report_date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('RoboticsReport', RoboticsReportSchema);

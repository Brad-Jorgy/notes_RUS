var mongoose = require('mongoose');

module.exports = mongoose.model('Note', {
    title: {
        type: String,
        default: ''
    },
    body:{
        type: String,
        default: ''
    }
});
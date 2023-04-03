const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    searchTerm: String,
    searchResults: Array
});

module.exports = mongoose.model('search', searchSchema);
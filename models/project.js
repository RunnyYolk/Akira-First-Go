var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: Array
});

module.exports = mongoose.model('Project', projectSchema);

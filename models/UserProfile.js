var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UPSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  longtitude: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('UserProfile', UPSchema);

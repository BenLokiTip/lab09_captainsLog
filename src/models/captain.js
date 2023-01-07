const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
  captain: { type: String, required: true },
  firstOfficer: { type: String, required: true },
  ship: { type: String, required: false}, //sometimes a captain loses her ship!
  shipImg: { type: String }
});

// Use your schema to craft a model captain
const captainModel = mongoose.model('captain', captainSchema);

module.exports = captainModel;
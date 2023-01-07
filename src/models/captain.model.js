const { DataTypes } = require('sequelize');

function makeCaptain(sequelize) {
  return sequelize.define('Captain', {
    name: DataTypes.STRING,
    firstOfficer: DataTypes.STRING,
    ship: DataTypes.STRING, //sometimes a captain loses her ship!
    // shipImg: DataTypes.STRING,  --add back in after fully functional
  });
}
  
module.exports = { makeCaptain };
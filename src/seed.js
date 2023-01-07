'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_CONNECT);
const CaptainModel = ('./models/captain');

async function seedCaptains() {
  console.log('seeding captains...');

  //creating Sisko
    await CaptainModel.create({
    captain: 'Sisko, Benjamin',
    firstOfficer: 'Kira',
    ship: 'USS Defiant',
    shipImg: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/97/DefiantDS9.jpg/220px-DefiantDS9.jpg',
  });
  //creating Janeway
   await CaptainModel.create({
    captain: 'Janeway, Kathryn',
    firstOfficer: 'Chakotay',
    ship: 'USS Voyager',
    shipImg: 'https://static.wikia.nocookie.net/memoryalpha/images/9/9f/Intrepid_class_top_quarter_aft.jpg/revision/latest?cb=20070320211144&path-prefix=en',
   });
  
  //creating Kirk
  await CaptainModel.create({
    captain: 'Kirk, James',
    firstOfficer: 'Spock',
    ship: 'USS Enterprise',
    shipImg: 'https://static.wikia.nocookie.net/memoryalpha/images/b/be/USS_Enterprise_%28NCC-1701%29%2C_ENT.jpg/revision/latest/scale-to-width-down/350?cb=20171022133400&path-prefix=en',
  });
  
  //creating Picard
  await CaptainModel.create({
    captain: 'Picard, Jean-Luc',
    firstOfficer: 'Riker',
    ship: 'USS Enterprise E',
    shipImg: 'https://static.wikia.nocookie.net/memoryalpha/images/6/66/USS_Enterprise-E_in_nebula.jpg/revision/latest/scale-to-width-down/350?cb=20170519170420&path-prefix=en',
  });
  
  mongoose.disconnect();

  console.log('done seeding!');
};

seedCaptains();
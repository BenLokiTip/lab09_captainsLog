require('dotenv').config();

const { sequelize } = require('./models');
const { server } = require('./server');

const port = process.env.PORT || 3000;
server.listen(port, async () => {
//  await sequelize.drop();
  await sequelize.sync({alter:true}); // alter:true here forces changes to existing tables 
  console.log(`Listening on ${port}`);
});

const bcrypt = require('bcrypt');
const { sequelize, AuthUser } = require('../src/models');

describe('Auth Model', () => {
  beforeEach(() => sequelize.sync());
  afterEach(() => sequelize.drop());

  it('can create a user', async () => {
    const user = await AuthUser.createWithHashed('loki', 'meow');
    expect(user.username).toBe('loki');
    expect(bcrypt.compareSync('meow', user.username));
  });

  describe('findUser', () => {
    it('finds valid user', async () => {
      await AuthUser.createWithHashed('loki', 'meow');
      const user = await AuthUser.findLoggedIn('loki', 'meow');
      expect(user).toBeDefined();
    });

    it('nulls for invalid password', async () => {
      await AuthUser.createWithHashed('loki', 'meow');
      const user = await AuthUser.findLoggedIn('loki', 'badpass');
      expect(user).toBe(null);
    });

    it('nulls for missing user', async () => {
      await AuthUser.createWithHashed('loki', 'meow');
      const user = await AuthUser.findLoggedIn('someone', 'meow');
      expect(user).toBe(null);
    });
  });
});

const b64 = require('base-64');
const { sequelize, AuthUser } = require('../src/models');
const { signin } = require('../src/auth/router');

describe('Auth Routes', () => {
  it('returns a web token for a sign in route', async () => {
    // arrange
    await sequelize.sync();
    await AuthUser.createWithHashed('loki', 'meow');

    // act
    const req = {
      header: jest.fn().mockImplementation((header) => {
        if (header === 'Authorization') {
          return 'Basic ' + b64.encode('loki:meow');
        }
        return '';
      }),
    };
    const res = { send: jest.fn() };
    const next = jest.fn();
    await signin(req, res, next);

    // assert
    const token = res.send.mock.lastCall[0];
    const [_header, payloadBase64, _signature] = token.split('.');
    const payload = JSON.parse(b64.decode(payloadBase64));
    expect(payload.username).toBe('loki');
  });
});
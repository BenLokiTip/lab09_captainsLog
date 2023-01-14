const b64 = require('base-64');
const { sequelize, AuthUser } = require('../src/models');
const { signin } = require('../src/auth/router');

const supertest = require('supertest');
const { server } = require('../src/server');
const request = supertest(server);

describe('Auth Routes', () => {
  it('returns a web token for a sign in route', async () => {
    // arrange
    await sequelize.sync();
    await AuthUser.createWithHashed('loki', 'meow', 'admin');

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
    const token = res.send.mock.lastCall[0].token;
    const [_header, payloadBase64, _signature] = token.split('.');
    const payload = JSON.parse(b64.decode(payloadBase64));
    expect(payload.username).toBe('loki');
  });
});

const createCaptains = async () => {
  await AuthUser.createWithHashed('loki', 'meow', 'admin');
  const signinResponse = await request
    .post('/signin')
    .set('Authorization', 'Basic bG9raTptZW93')
    .send({});
  const token = signinResponse.body.token;
  await request.post('/captain').set('Authorization', `Bearer ${token}`).send({
    name: 'Kirk',
    firstOfficer: 'Spock',
    ship: 'Enterprise',
  });
  await request.post('/captain').set('Authorization', `Bearer ${token}`).send({
    name: 'Picard',
    firstOfficer: 'Riker',
    ship: 'Enterprise-E',
  });
};

describe('Captain routes', () => {
  beforeEach(() => sequelize.sync());
  afterEach(() => sequelize.drop());

  it('creates a captain', async () => {
    await AuthUser.createWithHashed('loki', 'meow', 'admin');
    const signinResponse = await request
      .post('/signin')
      .set('Authorization', 'Basic bG9raTptZW93')
      .send({});
    const token = signinResponse.body.token;
    let res = await request
      .post('/captain')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Kirk',
        firstOfficer: 'Spock',
        ship: 'Enterprise',
      });
    expect(res.body.name).toBe('Kirk');
  });

  it('gets a captain', async () => {
    await createCaptains();
    await AuthUser.createWithHashed('loki', 'meow', 'admin');
    const signinResponse = await request
      .post('/signin')
      .set('Authorization', 'Basic bG9raTptZW93')
      .send({});
    const token = signinResponse.body.token;
    let res = await request
      .get('/captain/1')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Kirk');
    expect(res.body.firstOfficer).toBe('Spock');
    expect(res.body.ship).toBe('Enterprise');
  });

  it('gets all captains', async () => {
    await createCaptains();
    await AuthUser.createWithHashed('loki', 'meow', 'admin');
    const signinResponse = await request
      .post('/signin')
      .set('Authorization', 'Basic bG9raTptZW93')
      .send({});
    const token = signinResponse.body.token;
    let res = await request
      .get('/captain')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[1].name).toBe('Picard');
    expect(res.body[1].firstOfficer).toBe('Riker');
    expect(res.body[1].ship).toBe('Enterprise-E');
  });

  it('updates a captain', async () => {
    await createCaptains();
    await AuthUser.createWithHashed('loki', 'meow', 'admin');
    const signinResponse = await request
      .post('/signin')
      .set('Authorization', 'Basic bG9raTptZW93')
      .send({});
    const token = signinResponse.body.token;
    let res = await request
      .put('/captain/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ship: 'Enterprise-E',
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Kirk');
    expect(res.body.ship).toBe('Enterprise-E');
  });
});

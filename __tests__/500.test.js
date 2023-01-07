const { serverError } = require('../src/middleware/500');

describe('serverError middleware', () => {
  it('should set the status code to 500 and send a response with an error message', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    serverError(new Error('server error'), req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'there was a problem! 🧨',
      err: 'server error',
    });
  });
});

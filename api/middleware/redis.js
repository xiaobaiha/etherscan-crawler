const redis = require('redis');

const client = redis.createClient(6379, '127.0.0.1');
client.connect();

const EXPIRE_TIME = 3;

module.exports = async (req, res, next) => {
  // Attach redis to request
  req.ctx = req.ctx || {};
  req.ctx.redis = {
    get: (key) =>
      new Promise((resolve) => {
        try {
          client.get(key).then(resolve);
        } catch (err) {
          console.error('ctx redis get err: ', err);
          resolve(null);
        }
      }),
    set: (key, value) =>
      new Promise((resolve) => {
        try {
          client
            .set(key, value, {
              EX: EXPIRE_TIME,
            })
            .then(resolve);
        } catch (err) {
          console.error('ctx redis set err: ', err);
          resolve(null);
        }
      }),
  };
  next();
};

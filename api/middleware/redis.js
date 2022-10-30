const { redis } = require('../libs/db');

const EXPIRE_TIME = 10;

module.exports = async (req, res, next) => {
  // Attach redis to request
  req.ctx = req.ctx || {};
  req.ctx.redis = {
    get: (key) =>
      new Promise((resolve) => {
        try {
          redis.get(key).then(resolve);
        } catch (err) {
          console.error('ctx redis get err: ', err);
          resolve(null);
        }
      }),
    set: (key, value) =>
      new Promise((resolve) => {
        try {
          redis
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

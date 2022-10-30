const { getTransactions } = require('../service/bscscan');
const logger = require('../libs/logger');

const DEFAULT_PAGE = 1;

const reqKey = (query) => `${query.address}_${query.page}`;

const getQueryNumber = (param, defaultValue) => {
  if (!param) {
    return defaultValue;
  }
  if (Number.isNaN(Number(param))) {
    return defaultValue;
  }
  return Number(param);
};

const formatQuery = (query) => {
  if (!query.a) {
    throw new Error('Param "address" is required!');
  }
  return {
    address: query.a,
    page: getQueryNumber(query.p, DEFAULT_PAGE),
  };
};

const getAddressTransactions = async (req, res) => {
  const params = formatQuery(req.query);
  // response content type
  res.setHeader('Content-Type', 'application/json');

  // test if redis match
  const cacheKey = reqKey(params);
  const redisContent = await req.ctx.redis.get(cacheKey);
  if (redisContent) {
    logger.log('Req match redis(', JSON.stringify(params), ').');
    res.end(redisContent);
  } else {
    const transactions = await getTransactions(params);
    const transactionsStr = JSON.stringify(transactions);
    await req.ctx.redis.set(cacheKey, transactionsStr);
    res.end(transactionsStr);
  }
};

module.exports = { getAddressTransactions };

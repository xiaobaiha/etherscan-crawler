const axios = require('axios');
const { JSDOM } = require('jsdom');

const getTransactions = ({ address, page = 1 }) => {
  return axios.get(`https://bscscan.com/txs?a=${address}&p=${page}`).then((res) => {
    const dom = new JSDOM(res.data);
    const result = dom.window.document.querySelectorAll('table tbody tr');
    return Array.from(result).map((tr) => {
      // eslint-disable-next-line no-unused-vars
      const [, txnHash, _method, block, date, _age, from, _type, _to, value, txnFee] = Array.from(
        tr.querySelectorAll('td')
      ).map((el) => el.textContent);
      const method = tr.querySelector('td:nth-child(3) span').getAttribute('title');
      const to = tr.querySelector('td:nth-child(9) span a').getAttribute('href').replace('/address/', '');
      return {
        txnHash,
        method,
        block,
        date,
        to,
        from,
        value: Number(value.replace(' BNB', '')),
        txnFee: Number(txnFee),
      };
    });
  });
};

module.exports = {
  getTransactions,
};

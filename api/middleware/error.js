module.exports = (req, res, next) => {
  try {
    next();
  } catch (err) {
    res.status(500);
    res.render('error', { error: err });
  }
};

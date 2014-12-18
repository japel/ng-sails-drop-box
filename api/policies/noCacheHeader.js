// policies/hsts.js
module.exports = function hsts(req, res, next) {
  if (typeof res.setHeader === 'function') {
    res.setHeader("Cache-Control", "private, max-age=0, no-cache");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "-1");
  }
  next();
};

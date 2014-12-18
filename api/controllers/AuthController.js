// Location: /api/controllers/AuthController.js
var passport = require("passport");
module.exports = {
  login: function (req, res) {
    passport.authenticate('local', function (err, user, info) {
      if ((err) || (!user)) {
        console.log("login err 1", info);
        return res.status(401).json({error: true, success: false, message: 'failed auth'});
      }
      req.logIn(user, function (err) {
        if (err) {
          console.log("login err 2", err, info);
          return res.status(401).json({error: true, success: false, message: 'failed auth'});
        }
        return res.json(user[0]);
      });
    })(req, res);
  },

  logout: function (req, res) {
    req.logout();
    return res.json({error: false, success: true, message: 'logout success'});
  },

  current: function (req, res) {
    if(req.session.passport.user){
      User.findOne(req.session.passport.user).exec(function (err, user) {
        if(!err && user) return res.ok(user);
        else{
          return res.status(401).json({error: true, success: false, message: 'no one auth'});
        }
      })
    } else {
      return res.status(401).json({error: true, success: false, message: 'no one auth'});
    }
  },
  _config: {}
};

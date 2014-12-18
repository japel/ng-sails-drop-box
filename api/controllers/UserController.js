/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  subscribe: function (req, res) {
    if (typeof req.session.passport.user !== 'undefined') { //user is logged in
      User.findOne(req.session.passport.user).exec(function (err, resultUser) {
        if (!err && resultUser) {
          console.log("%s tries to subscribe", resultUser.username);
          User.subscribe(req, resultUser, ['message']);
          res.json({success: true, user: resultUser});
        } else {
          res.forbidden({message: 'login required.'});
        }
      });
    } else {
      res.forbidden({message: 'login required.'});
    }
  },
  query: function (req, res) {
    User.find({}).exec(function (err, results) {
      res.json(results);
    })
  }
};


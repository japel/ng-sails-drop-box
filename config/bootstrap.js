/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

  var admin = {
    username: 'Admin',
    password: 'admin'
  };

  var testUser = {
    username: 'Testuser',
    password: 'admin'
  };

  var rootFolder = {
    parent: null,
    name: '$$root',
    private: false
  };

  GLOBAL.FTPTHumbsPath = '.thumbs';

  var fs = require("fs");

  function ensureExists(path) {
    try {
      fs.mkdirSync(path);
    } catch (e) {

    }
  }

  ensureExists(GLOBAL.FTPTHumbsPath);

  User.findOrCreate({
    username: admin.username
  }, admin, function (err, admin) {
    GLOBAL.FTPAdmin = admin;

    User.findOrCreate({
      username: testUser.username
    }, testUser, function () {

      Folder.findOrCreate(rootFolder, rootFolder, function (err, rootFolder) {
        GLOBAL.FTPRoot = rootFolder;
        cb();
      });
    });
  });
};

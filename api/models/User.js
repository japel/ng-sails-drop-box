/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');
module.exports = {

  attributes: {

    username: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    messages: {
      collection: 'message',
      via: 'user'
    },
    chats: {
      collection: 'chat',
      via: 'members'
    },
    folders: {
      collection: 'folder',
      via: 'owner'
    },

    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }

  },

  beforeCreate: function (user, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        } else {
          user.password = hash;
          cb(null, user);
        }
      });
    });
  }
};


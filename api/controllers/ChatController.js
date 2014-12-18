/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var marked = require('marked');

module.exports = {
  post: function (req, res) {
    var pk = req.param('chatId');
    var body = req.param('msg');
    var user = req.session.passport.user;

    Chat.findOne(pk).exec(function (err, chat) {
      if (!err && chat) {
        chat.messages.add({user: user, body: marked(body)});
        chat.save(function () {
          Chat
            .findOne(pk)
            .populate('messages', {sort: 'createDESCDESC'})
            .populate('members')
            .exec(function (err, chat) {
              res.ok(chat);
              Chat.publishUpdate(chat.id, _.cloneDeep(chat));
            });
        });
      }
    })
  },
  create: function (req, res) {
    var to = req.param('to');
    if(!to) return res.badRequest({message: 'lol nope 1'});
    var user = req.session.passport.user;
    if(!user) return res.badRequest({message: 'lol nope 2'});
    var identifier = genIdentifier([to, user]);

    Chat.findOrCreate({identifier: identifier}, {
      identifier: identifier,
      creator: user,
      members: [to, user + ''],
      type: 'pm'
    }).exec(function (err, chat) {
      chat.members.add(to);
      chat.members.add(user + '');
      chat.save(function (result, arg1, arg2) {
        res.json(chat);
      });
    });
  },
  pm: function (req, res) {
    var to = req.param('to');
    var body = req.param('msg');
    var user = req.session.passport.user;
    var identifier = genIdentifier([to, user]);

    Chat.findOrCreate({identifier: identifier}, {
      identifier: identifier,
      creator: user,
      members: [to, user + ''],
      type: 'pm'
    }).exec(function (err, chat) {
      chat.messages.add({user: user, body: marked(body)});
      chat.members.add([to, user + '']);
      chat.save(function () {
        Chat
          .findOne({identifier: identifier})
          .populate('messages', {sort: 'createdAt DESC'})
          .populate('members')
          .exec(function (err, chat) {
            res.ok(chat);
            Chat.publishUpdate(chat.id, _.cloneDeep(chat));
          });
      });
    });
  },
  find: function (req, res) {
    var user = req.user;
    if (!user) return res.json([]);
    var ids = [];

    User.findOne(user.id).populate('chats').exec(function (err, user) {
      for (var i = 0; i < user.chats.length; i++) {
        var chat = user.chats[i];
        ids.push(chat.id);
        Chat
          .find(ids)
          .where({type: 'pm'})
          .populate('messages', {sort: 'createdAt DESC'})
          .populate('members')
          .exec(function (err, chats) {

            if (req._sails.hooks.pubsub && req.isSocket) {
              Chat.subscribe(req, chats);
              if (req.options.autoWatch) {
                Chat.watch(req);
              }
            }

            res.ok(chats);
          });
      }
    });


  },
  findOne: function (req, res) {
    var pk = req.param('id');
    Chat
      .findOne(pk)
      .populate('messages', {sort: 'createdAt ASC'})
      .populate('members')
      .exec(function (err, chat) {

        if (req._sails.hooks.pubsub && req.isSocket) {
          Chat.subscribe(req, chat);
          if (req.options.autoWatch) {
            Chat.watch(req);
          }
        }

        res.ok(chat);
      });
  }
};

function genIdentifier(users) {
  var out = [];
  var idString;
  for (var i = 0; i < users.length; i++) {
    var userID = users[i] + '';
    out.push(userID);
  }
  out.sort();
  idString = out.join('-');
  return '-' + idString + '-';
}

/**
* Chat.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    identifier: 'string',

    creator: {
      model: 'user'
    },

    messages: {
      collection: 'message',
      via: 'chat'
    },

    members: {
      collection: 'user',
      via: 'chats'
    },

    type: 'string'
  }
};


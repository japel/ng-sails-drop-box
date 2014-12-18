/**
 * Folder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    owner: {
      model: 'user'
    },
    name: {
      type: 'string',
      required: true
    },
    private: {
      type: 'boolean',
      defaultsTo: true
    },
    files: {
      collection: 'file',
      via: 'folder'
    },
    children: {
      collection: 'folder',
      via: 'parent'
    },
    parent: {
      model: 'folder'
    }

  },

  beforeCreate: function (values, cb) {
    if(typeof values.parent === 'undefined'){
      values.parent = GLOBAL.FTPRoot.id;
    }
    if(typeof values.owner === 'undefined'){
      values.owner = GLOBAL.FTPAdmin.id;
    }
    cb();
  }
};


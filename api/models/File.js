/**
 * File.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var fs = require('fs');
var pathLib = require('path');

module.exports = {

    attributes: {

        path: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        mime: {
            type: 'string'
        },
        thumb: {
            type: 'string'
        },
        accessCounter: {
            type: 'integer',
            defaultsTo: 0
        },
        folder: {
            model: 'folder'
        },
        toJSON: function () {
            delete this.path;
            return this;
        }

    },
    afterDestroy: function (destroyedRecords, cb) {
        for (var i = 0, ii = destroyedRecords.length; i < ii; i++) {
            var record = destroyedRecords[i];
            console.log("rm", record.path);
            fs.unlinkSync(record.path);
            if (record.thumb)fs.unlinkSync(GLOBAL.FTPTHumbsPath + '/' + pathLib.basename(record.thumb))
        }
        cb();
    }
};

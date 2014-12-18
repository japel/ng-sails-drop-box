/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require("fs");
var Q = require('q');
var gm = require('gm').subClass({imageMagick: true});
var mime = require('mime');
var pathLib = require('path');

function ensureExists(path) {
    try {
        fs.mkdirSync(path);
    } catch (e) {

    }
}

module.exports = {
    thumb: function (req, res) {
        var file = req.params.file;
        var path = GLOBAL.FTPTHumbsPath + '/' + file;
        res.sendfile(path);
    },
    upload: function (req, res) {

        function createFileEntry(file) {
            var deferred = Q.defer();
            var obj = {};

            obj.path = file.fd;
            obj.folder = req.param('folder') || GLOBAL.FTPRoot.id;
            obj.name = file.filename.replace(/[^a-zA-Z0-9-_\. \(\)]/gi, "");
            obj.mime = mime.lookup(obj.path);
            var parts = obj.name.split('.');
            var extension = parts[parts.length - 1];

            if (['jpg', 'jpeg', 'png'].indexOf(extension.toLowerCase()) != -1) {
                ensureExists(GLOBAL.FTPTHumbsPath);
                gm(obj.path)
                    .resize(200, 200)
                    .write(GLOBAL.FTPTHumbsPath + '/' + pathLib.basename(file.fd), function (err, buffer) {
                        if (err) throw(err);
                        obj.thumb = '/thumbs/' + pathLib.basename(file.fd);
                        File.create(obj, function (err, file) {
                            if (err)console.log(err);
                            deferred.resolve(file);
                        });
                    });
            } else {
                File.create(obj, function (err, file) {
                    if (err)console.log(err);
                    deferred.resolve(file);
                });
            }
            return deferred.promise;
        }

        res.setTimeout(0);
        var f = req.file('file');
        req.file('file')
            .upload({
                maxBytes: 1048576000
            }, function whenDone(err, uploadedFiles) {
                var prms = [];
                for (var i = 0, ii = uploadedFiles.length; i < ii; i++) {
                    prms.push(createFileEntry(uploadedFiles[i]));
                }
                Q.all(prms).then(function (results) {
                    res.ok(results);
                });
            });
    },
    get: function (req, res) {
        var uid = req.session.passport.user;
        var pk = req.params.id;

        File.findOne(pk).populateAll().exec(function (err, file) {
            if (err) res.serverError(err);
            else if (!file) res.notFound();
            else {
                if (!file.folder.private || file.folder.owner == uid) {
                    file.accessCounter++;
                    file.save(function () {
                        setTimeout(function () {
                          res.sendfile(file.path);
                        }, 200);
                    });
                } else {
                    res.forbidden();
                }
            }
        });

    }
};

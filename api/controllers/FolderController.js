/**
 * FolderController
 *
 * @description :: Server-side logic for managing folders
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');

module.exports = {
  info: function (req, res) {
    var pk = req.params.id || GLOBAL.FTPRoot.id;

    Folder
      .findOne(pk)
      .populate('children')
      .populate('files')
      .populate('parent')
      .exec(function (err, result) {
        if (err) return res.serverError(err);
        else if (!result) return res.notFound();
        res.ok(result);
      });
  },
  del: function (req, res) {
    var pk = req.params.id;
    if (!pk) {
      return res.serverError({info: 'missing pk in route'});
    }

    deleteOne(pk).then(function () {
      res.json({ok: true});
    });

    function removeOne(el) {
      var deferred = Q.defer();
      el.destroy(deferred.resolve);
      return deferred.promise;
    }

    function deleteOne(pk) {
      var deferred = Q.defer();
      var prms = [];

      Folder
        .findOne(pk)
        .populate('children')
        .populate('files')
        .populate('parent')
        .exec(function (err, result) {
          if (err) return res.serverError(err);
          else if (!result) return res.notFound();
          for (var i = 0; i < result.children.length; i++) {
            var child = result.children[i];
            prms.push(deleteOne(child.id));
          }
          for (var i = 0; i < result.files.length; i++) {
            var file = result.files[i];
            prms.push(removeOne(file));
          }
          prms.push(removeOne(result));
          Q.all(prms).then(function () {
            deferred.resolve();
          })
        });

      return deferred.promise;
    }
  }
};

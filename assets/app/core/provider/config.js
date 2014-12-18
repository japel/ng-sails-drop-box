/**
 * User: abau
 * Date: 28.11.2014
 * Time: 15:25
 */
angular.module("app.core").provider('config', function () {
  var configs = {};

  function configGetter(namespace) {
    if (!configs[namespace]) {
      configs[namespace] = {};
    }
    return configs[namespace];
  }

  var out = {
    get: configGetter,
    $get: function () {
      return out;
    }
  };

  return out;
});

/**
 * User: abau
 * Date: 04.12.2014
 * Time: 18:34
 */
angular.module("app.messages").filter('htmlToPlaintext', function () {
  return function (text) {
    return String(text).replace(/<[^>]+>/gm, '');
  }
});

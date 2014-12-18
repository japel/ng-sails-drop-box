/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  'dependencies/angular-material/angular-material.css',
  'dependencies/angular-material/themes/blue-grey-theme.css',
  'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
  'dependencies/jquery/dist/jquery.js',
  'dependencies/ng-file-upload/angular-file-upload-shim.js',

  'dependencies/angular/angular.js',
  'dependencies/angular-resource/angular-resource.js',
  'dependencies/angular-route/angular-route.js',
  'dependencies/angular-aria/angular-aria.js',
  'dependencies/angular-animate/angular-animate.js',
  'dependencies/hammerjs/hammer.js',
  'dependencies/angular-material/angular-material.js',
  'dependencies/ng-file-upload/angular-file-upload.js',
  'dependencies/slick-carousel/slick/slick.js',
  'dependencies/angular-slick/dist/slick.js',

  'dependencies/angular_*/*.js',

  'js/**/*.js',

  'app/core/core.js',
  'app/core/**/*.js',

  'app/modules/**/module.js',
  'app/modules/**/*.js',

  'app/app.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});

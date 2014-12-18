/**
 * Compiles SASS files into CSS.
 *
 * ---------------------------------------------------------------
 *
 * Only the `assets/styles/importer.scss` is compiled.
 * This allows you to control the ordering yourself, i.e. import your
 * dependencies, mixins, variables, resets, etc. before other stylesheets)
 *
 * For usage docs see:
 *    https://github.com/gruntjs/grunt-sass
 */
module.exports = function (grunt) {

  grunt.config.set('manifest', {
    generate: {
      options: {
        basePath: ".tmp/public/",
        cache: ['/dependencies/fontawesome/fonts/fontawesome-webfont.ttf?v=4.2.0', '/dependencies/fontawesome/fonts/fontawesome-webfont.woff?v=4.2.0'],
        network: ["*"],
        fallback: [],
        exclude: ['dependencies/jquery.cookie'],
        preferOnline: true,
        verbose: false,
        timestamp: true,
        hash: true
      },
      src: [
        "**/*.*"
      ],
      dest: ".tmp/public/manifest.appcache"
    }
  });
  grunt.loadNpmTasks('grunt-manifest');
};

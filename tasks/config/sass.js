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
 * 		https://github.com/gruntjs/grunt-sass
 */
module.exports = function(grunt) {

  grunt.config.set('sass', {
    dev: {
      options: {
        outputStyle: 'expanded', //compressed|compact|nested
        sourceComments: 'normal'
      },
      files: {
        '.tmp/public/styles/style.css': 'assets/styles/importer.scss'
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
};

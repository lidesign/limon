/* eslint-env node */

/**
 * @license
 * Copyright MNF (illvart) All Rights Reserved.
 * https://github.com/illvart
 *
 * This code licensed under the MIT License.
 * LICENSE file at https://github.com/illvart/illvart/blob/master/LICENSE
 */

const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const cssbeautify = require('gulp-cssbeautify');
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');
const presetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');
const discardComments = require('postcss-discard-comments');

module.exports = ({ config, browserSync, reload, generateId, gulp, debug, rename, sourcemaps }) => {
  const paths = {
    scss: './src/assets/scss/**/*.scss',
    input: {
      scss: './src/assets/scss/style/style.scss'
    },
    output: {
      scss: './src/assets/css/build/'
    }
  };

  // postcss for development mode
  const postcssDev = [
    presetEnv({
      /**
       * Disable prefix on development mode
       * because just for production
       */
      autoprefixer: false
    })
  ];
  // postcss for production mode
  const postcssProd = [
    mqpacker,
    presetEnv, // package.json -> browserslist
    cssnano({
      // Discard comments not working on /*! comments
      discardComments: {
        removeAll: true
      }
    }),
    discardComments({
      // Force remove all comments on production mode (not map)
      removeAll: true
    })
  ];
  // postcss -> cssnano and discardComments
  const postcssNano = [
    cssnano({
      // Discard comments not working on /*! comments
      discardComments: {
        removeAll: true
      }
    }),
    discardComments({
      // Force remove all comments on production mode (not map)
      removeAll: true
    })
  ];

  /**
   * Style development mode
   * Include map
   */
  gulp.task('css:dev', () =>
    gulp
      .src(paths.input.scss)
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
      .pipe(postcss(postcssDev))
      // Beautify CSS build to faster check view-source
      .pipe(
        cssbeautify({
          indent: '  ',
          autosemicolon: true
        })
      )
      /**
       * Dynamic css name
       * See template.js
       */
      .pipe(rename(`style.${generateId}.css`))
      .pipe(sourcemaps.write('.'))
      .pipe(debug({ title: 'CSS compiled development:' }))
      .pipe(gulp.dest(paths.output.scss))
      .pipe(browserSync.stream())
  );

  /**
   * Style production mode
   * Always include map on production for faster debugging.
   */
  gulp.task('css:prod', () =>
    gulp
      .src(paths.input.scss)
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(postcss(postcssProd))
      /**
       * Dynamic css name
       * see template.js
       */
      .pipe(rename(`style.${generateId}.min.css`))
      .pipe(sourcemaps.write('.'))
      .pipe(debug({ title: 'CSS compiled production:' }))
      .pipe(gulp.dest(paths.output.scss))
  );

  /**
   * Material Design Icons
   * Minify version without map used for both development and production.
   */
  gulp.task('mdi', () =>
    gulp
      .src('./src/assets/scss/mdi/materialdesignicons.scss')
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(postcss(postcssNano))
      // Get the name from config.yml
      .pipe(rename(`${config.fileName.mdi}.css`))
      .pipe(debug({ title: 'Material Design Icons:' }))
      .pipe(gulp.dest(paths.output.scss))
  );

  // watch css development mode
  gulp.task('watch:scss', () => {
    // First run css:dev then copy:css build output, reload
    gulp.watch(paths.scss, gulp.series('css:dev', 'copy:css', reload));
  });
};

/* eslint-env node */

/**
 * @license
 * Copyright MNF (illvart) All Rights Reserved.
 * https://github.com/illvart
 *
 * This code licensed under the MIT License.
 * LICENSE file at https://github.com/illvart/illvart/blob/master/LICENSE
 */

const htmlmin = require('gulp-htmlmin');
const prettyData = require('gulp-pretty-data');
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');

module.exports = ({ output, gulp, debug }) => {
  // minify html
  gulp.task('minifyHtml', () =>
    gulp
      .src(`${output}/**/*.html`)
      .pipe(
        htmlmin({
          html5: true,
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: false, // Avoid decode email address
          preventAttributesEscaping: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeTagWhitespace: false
        })
      )
      .pipe(debug({ title: 'Minify HTML:' }))
      .pipe(gulp.dest(output))
  );

  // Avoid copying private files
  const minifyPrettify = ['./src/site.webmanifest'];
  // Minify xml, json
  gulp.task('minify', () =>
    gulp
      .src(minifyPrettify)
      .pipe(
        prettyData({
          type: 'minify',
          preserveComments: true,
          extensions: {
            xlf: 'xml',
            webmanifest: 'json'
          }
        })
      )
      .pipe(debug({ title: 'Minify:' }))
      .pipe(gulp.dest(output))
  );
  // Prettify xml, json
  gulp.task('prettify', () =>
    gulp
      .src(minifyPrettify)
      .pipe(
        prettyData({
          type: 'prettify',
          extensions: {
            xlf: 'xml',
            webmanifest: 'json'
          }
        })
      )
      .pipe(debug({ title: 'Prettify:' }))
      .pipe(gulp.dest(output))
  );

  // Images compress
  gulp.task('imagesCompress', () =>
    gulp
      .src(['./src/assets/img/**/*.{jpg,jpeg,png,svg}'])
      //.pipe(imagemin([imagemin.jpegtran({ progressive: true }), imagemin.optipng({ optimizationLevel: 5 })]))
      .pipe(imagemin([pngquant({ quality: [0.5, 0.5] }), mozjpeg({ quality: 50 })]))
      .pipe(gulp.dest(`${output}/assets/img/`))
  );

  // copy images
  gulp.task('copy:images', () =>
    gulp
      .src(['./src/assets/img/**'])
      .pipe(debug({ title: 'Copy images files:' }))
      .pipe(gulp.dest(`${output}/assets/img/`))
  );

  // copy css
  gulp.task('copy:css', () =>
    gulp
      .src(['./src/assets/css/build/**'])
      .pipe(debug({ title: 'Copy CSS files:' }))
      .pipe(gulp.dest(`${output}/assets/css/`))
  );

  // copy fonts
  gulp.task('copy:fonts', () =>
    gulp
      .src(['./src/assets/fonts/**'])
      .pipe(debug({ title: 'Copy fonts files:' }))
      .pipe(gulp.dest(`${output}/assets/fonts/`))
  );

  // copy misc files
  gulp.task('copy:misc', () =>
    gulp
      .src(['./src/_redirects'])
      .pipe(debug({ title: 'Copy misc files:' }))
      .pipe(gulp.dest(output))
  );
};

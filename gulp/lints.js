/* eslint-env node */

/**
 * @license
 * Copyright MNF (illvart) All Rights Reserved.
 * https://github.com/illvart
 *
 * This code licensed under the MIT License.
 * LICENSE file at https://github.com/illvart/illvart/blob/master/LICENSE
 */

const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');

module.exports = ({ reports, gulp }) => {
  // Linting javascript
  gulp.task('lint:js', () =>
    gulp
      .src('./**/*.js')
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  );

  // Linting css/scss
  gulp.task('lint:scss', () =>
    gulp.src(['./src/assets/scss/**/*.scss']).pipe(
      stylelint({
        failAfterError: true,
        // Reports linting
        reportOutputDir: `${reports}/lint/`,
        reporters: [
          {
            formatter: 'verbose',
            console: true
          },
          {
            formatter: 'json',
            // Check our reports
            save: 'stylelint-report.json'
          }
        ],
        debug: true
      })
    )
  );
};

/*!
 * Copyright 2019 MNF (illvart)
 * This code licensed under the MIT License.
 * https://github.com/illvart
 */

const eslint = require("gulp-eslint");
const stylelint = require("gulp-stylelint");

module.exports = ({ reports, gulp }) => {

  // linting javascript
  gulp.task("lint:js", () => {
    return gulp
      .src("./src/**/*.js")
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  });

  // linting css/scss
  gulp.task("lint:scss", () => {
    return gulp.src(["./src/assets/scss/**/*.scss"]).pipe(
      stylelint({
        failAfterError: true,
        // reports linting
        reportOutputDir: `${reports}/lint/`,
        reporters: [
          {
            formatter: "verbose",
            console: true
          },
          {
            formatter: "json",
            // check our reports
            save: "stylelint-report.json"
          }
        ],
        debug: true
      })
    );
  });

};

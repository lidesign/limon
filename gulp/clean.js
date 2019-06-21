/*!
 * Copyright 2019 MNF (illvart)
 * This code licensed under the MIT License.
 * https://github.com/illvart
 */

module.exports = ({ output, del, gulp }) => {

  gulp.task("clean", () => {
    return del([
      // clean build output
      output,
      // clean build css (scss output)
      "./src/assets/css/build/"
    ]);
  });

};

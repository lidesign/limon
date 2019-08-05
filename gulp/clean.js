/* eslint-env node */

/**
 * @license
 * Copyright MNF (illvart) All Rights Reserved.
 * https://github.com/illvart
 *
 * This code licensed under the MIT License.
 * LICENSE file at https://github.com/illvart/illvart/blob/master/LICENSE
 */

module.exports = ({ output, del, gulp }) => {
  gulp.task('clean', () =>
    del([
      // Clean build output
      output,
      // Clean build css (scss output)
      './src/assets/css/build/'
    ])
  );
};

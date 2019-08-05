/* eslint-env node */

/**
 * @license
 * Copyright MNF (illvart) All Rights Reserved.
 * https://github.com/illvart
 *
 * This code licensed under the MIT License.
 * LICENSE file at https://github.com/illvart/illvart/blob/master/LICENSE
 */

'use strict';

const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = (dirname, obj = {}) => {
  readdirSync(dirname)
    // .filter(path => path.endsWith('.js'))
    .forEach((module) => {
      require(`./${join(dirname, module)}`)(obj);
    });
};

/*!
 * Copyright 2019 MNF (illvart)
 * This code licensed under the MIT License.
 * https://github.com/illvart
 */

"use strict";

const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = (dirname, obj = {}) => {
  readdirSync(dirname)
    // .filter(path => path.endsWith(".js"))
    .forEach((module) => {
      require(`./${join(dirname, module)}`)(obj);
    });
};

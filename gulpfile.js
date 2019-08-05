/* eslint no-console:'off' */
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

//
// Requirements
//
const fs = require('fs');
const del = require('del');
const yaml = require('js-yaml');

// Gulp
const gulp = require('gulp');
const debug = require('gulp-debug');
const rename = require('gulp-rename');
const inject = require('gulp-inject-string');
const sourcemaps = require('gulp-sourcemaps');

// Data
const loader = require('./loader');
const settings = require('./data/settings');
const output = `${settings.site.output}`;
const reports = `${settings.site.reports}`;

// yaml config
const config = yaml.safeLoad(fs.readFileSync('./data/config.yml', 'utf8'));

// browserSync
const browserSync = require('browser-sync').create();
// browserSync reload
const reload = (cb) => {
  browserSync.reload();
  cb();
};

// generateId for dynamic name
const crypto = require('crypto');
const generateId = crypto.randomBytes(6).toString('hex');

// load gulp task
loader('./gulp/', {
  settings,
  output,
  reports,
  config,
  browserSync,
  reload,
  generateId,
  fs,
  del,
  gulp,
  debug,
  rename,
  inject,
  sourcemaps
});

// server (browserSync)
const server = (cb) => {
  browserSync.init({
    server: {
      baseDir: output
    },
    watch: true,
    notify: true,
    port: `${settings.site.port}`,
    open: false,
    online: true,
    logLevel: 'warn',
    // your short name
    logPrefix: `${config.shortTitle}`,
    logConnections: false
  });
  cb();
};

// environment mode
const envMode = (mode) => (cb) => ((process.env.NODE_ENV = mode), cb());

// development mode: yarn serve
exports.serve = gulp.series(
  envMode('development'),
  'clean',
  // 'lint:js',
  // 'lint:scss',
  gulp.parallel('css:dev', 'mdi', 'js:dev'),
  'prettify',
  'nunjucks:render',
  'sitemap',
  'robots.txt',
  'copy:css',
  'copy:fonts',
  'copy:images',
  'copy:misc',
  'workbox',
  gulp.parallel(server, 'watch:scss', 'watch:js', 'watch:nunjucks', () => {
    console.log(`${new Date().toLocaleTimeString()} - Development version build finished!`);
  })
);

// production mode: yarn build
exports.default = gulp.series(
  envMode('production'),
  'clean',
  'lint:js',
  'lint:scss',
  gulp.parallel('css:prod', 'mdi', 'js:prod'),
  'minify',
  'nunjucks:render',
  'sitemap',
  'robots.txt',
  'copy:css',
  'copy:fonts',
  // 'copy:images',
  'imagesCompress', // Compress images only for production mode
  'copy:misc',
  'minifyHtml',
  'workbox',
  'workbox:minify',
  // 'js:credit', // Inject license to javascript
  (cb) => {
    console.log(`${new Date().toLocaleTimeString()} - Production version build finished!`);
    cb();
  }
);

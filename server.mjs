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

// Config
import settings from './data/settings';
const OUTPUT = `${settings.site.output}`;
const PORT = `${settings.site.port}`;

// CLI style
import chalk from 'chalk';
// Colors
const RED = chalk.red;
const CYAN = chalk.cyan;

// Express
import express from 'express';
const app = express();
app.use(express.static(OUTPUT));

// Check cache
app.get('/sw.js', (req, res, next) => {
  res.sendFile('/sw.js', { root: './' });
});

// Default port in /data/settings.js site.port
const listener = app.listen(process.env.PORT || PORT, () => {
  const LA = listener.address().port;
  console.log(`${CYAN('Starting up server, serving at')} ${OUTPUT}`);
  console.log(CYAN('Available on:'));
  console.log(`  http://localhost:${LA}`);
  console.log(`  http://127.0.0.1:${LA}`);
  console.log(RED('Press Ctrl+C to quit.'));
});

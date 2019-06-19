/*!
 * Copyright 2019 MNF (illvart). All Rights Reserved.
 *
 * Creative Commons Attribution 4.0 International License
 * https://creativecommons.org/licenses/by/4.0/
 *
 * GitHub: https://github.com/illvart
 */

"use strict";

import cfg from "./src/data/config";
const output = `${cfg.settings.output}`;

import express from "express";
const app = express();

app.use(express.static(output));

// default port 6661
const PORT = process.env.PORT || 6661;

const listener = app.listen(PORT, () => {
  const PA = listener.address().port;
  console.log("View on the browser:");
  console.log(`  http://127.0.0.1:${PA}`);
  console.log("  " + "or");
  console.log(`  http://localhost:${PA}`);
  console.log("Press Ctrl+C to quit.");
});

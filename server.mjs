/*!
 * Copyright 2019 MNF (illvart)
 * This code licensed under the MIT License.
 * https://github.com/illvart
 */

"use strict";

import settings from "./data/settings";
const output = `${settings.site.output}`;

import express from "express";
const app = express();

app.use(express.static(output));

// default port in /data/settings.js site.port
const PORT = process.env.PORT || `${settings.site.port}`;

const listener = app.listen(PORT, () => {
  const PA = listener.address().port;
  console.log("View on the browser:");
  console.log(`  http://127.0.0.1:${PA}`);
  console.log("  " + "or");
  console.log(`  http://localhost:${PA}`);
  console.log("Press Ctrl+C to quit.");
});

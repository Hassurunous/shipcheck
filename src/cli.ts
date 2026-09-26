#!/usr/bin/env node
import { formatStatus } from "./index.js";

console.log(formatStatus(process.argv.slice(2)));

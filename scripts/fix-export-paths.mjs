// Post-build fix for static exports built on Windows.
//
// Next's exporter joins segment paths with the OS separator, so on Windows a
// prefetch file meant to be `out/menu/__next.menu.__PAGE__.txt` is written as
// `out/menu/__next.menu/__PAGE__.txt`, and client-side prefetches 404.
// This flattens those folders back into dotted file names. On macOS/Linux
// there is nothing to fix and it exits quietly.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("out");
let moved = 0;

function flatten(dir, prefix, targetDir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const src = path.join(dir, entry.name);
    const name = `${prefix}.${entry.name}`;
    if (entry.isDirectory()) flatten(src, name, targetDir);
    else {
      fs.renameSync(src, path.join(targetDir, name));
      moved++;
    }
  }
  fs.rmdirSync(dir);
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) flatten(full, entry.name, dir);
    else if (entry.name !== "_next") walk(full);
  }
}

if (fs.existsSync(OUT)) {
  walk(OUT);
  if (moved) console.log(`fix-export-paths: flattened ${moved} prefetch file(s)`);
}

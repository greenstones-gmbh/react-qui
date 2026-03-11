import { readFileSync } from "fs";
import { join } from "path";

// 1️⃣ package.json einlesen
const pkg = JSON.parse(
  readFileSync(join(process.cwd(), "package.json"), "utf-8"),
);

// 2️⃣ Alle Peer Dependencies sammeln
const peerDeps = pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : [];

console.log("Excluding peer dependencies from bundle:", peerDeps);

await Bun.build({
  entrypoints: ["./index.ts"], // dein Einstiegspunkt
  outdir: "dist",
  bundle: true,
  external: peerDeps, // 👈 alle peerDeps automatisch extern
  minify: true,
  sourcemap: true,
});

console.log("Build finished!");

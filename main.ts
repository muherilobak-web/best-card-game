// Pasar Rempah: Duel Saudagar — program penyerahan entri make.fun.
// Menyalin game/ dan screenshots/ dari repositori ini ke direktori output
// (MAKEFUN_OUTPUT_DIR, atau /output bila tidak diset) lalu menulis
// dossier.json resmi dengan buildDossier dari vendor/makefun-game.ts.
// Hanya ISI direktori output yang dibersihkan, bukan direktorinya sendiri,
// dan hasilnya deterministik: dua kali jalan menulis dossier.json yang sama.
import { buildDossier } from './vendor/makefun-game.ts';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)));
const outputDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

function clearContents(dir: string): void {
  mkdirSync(dir, { recursive: true });
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

clearContents(outputDir);
for (const name of ['game', 'screenshots']) {
  const src = join(repoRoot, name);
  if (!existsSync(src)) throw new Error(`missing ${name}/ in repository`);
  cpSync(src, join(outputDir, name), { recursive: true });
}

writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
  }),
);
console.log(`dossier written to ${join(outputDir, 'dossier.json')}`);

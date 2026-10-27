import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** TW-01 banned legacy class tokens (split so this file is not a false positive). */
const TW01 = [
  ['auth', 'shell'],
  ['auth', 'main'],
  ['auth', 'card'],
  ['auth', 'lead'],
  ['auth', 'submit'],
  ['auth', 'switch'],
  ['form', 'group'],
  ['form', 'feedback'],
  ['btn', 'primary'],
  ['logo', 'icon'],
  ['papel', 'fieldset'],
  ['papel', 'option'],
  ['theme', 'toggle'],
].map((parts) => parts.join('-'));

TW01.push('logo');

function walkTsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkTsFiles(full));
      continue;
    }
    if (!/\.(tsx|ts)$/.test(entry.name)) continue;
    if (/\.test\.(tsx|ts)$/.test(entry.name)) continue;
    out.push(full);
  }
  return out;
}

describe('legacy CSS / TW-01', () => {
  it('classes legadas TW-01 ausentes em src TS/TSX de produção', () => {
    const files = walkTsFiles(join(process.cwd(), 'src'));
    const hits: string[] = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf8');
      for (const cls of TW01) {
        const re = new RegExp(
          String.raw`class(?:Name)?\s*=\s*["'\`][^"'\`]*\b${cls}\b`,
        );
        if (re.test(content)) {
          hits.push(`${file}: ${cls}`);
        }
      }
    }

    expect(hits).toEqual([]);
  });

  it('globals tokens :root e --primary preservados', () => {
    const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');
    expect(css).toMatch(/:root\s*\{/);
    expect(css).toMatch(/--primary\s*:/);
    expect(css).toMatch(/\.dark\s*\{/);
    expect(css).toMatch(/@theme\s+inline/);
  });
});

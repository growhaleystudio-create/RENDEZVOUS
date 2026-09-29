import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('section reveals never flash previously visible content dark or closed', () => {
  const motion = read('../src/scripts/editorial-motion.js');
  const intro = read('../src/styles/editorial-motion.css');
  const promo = read('../src/styles/promo.css');
  assert.doesNotMatch(motion, /opacity:\s*\.(?:15|2)\b/);
  assert.doesNotMatch(motion, /clipPath:\s*'inset\(0 (?:0 100%|100%)/);
  assert.doesNotMatch(promo, /clip-path:\s*inset\(0 0 100% 0\)/);
  assert.doesNotMatch(promo, /opacity:\s*0\s*;/);
  const heroCopyKeyframes = intro.match(/@keyframes editorial-copy-in\s*\{[\s\S]*?\n\}/)?.[0] ?? '';
  assert.doesNotMatch(heroCopyKeyframes, /opacity:/);
});

test('inert prototype entries keep their normal visuals without navigation or disabled semantics', () => {
  const html = read('../dist/index.html');
  const styles = read('../src/styles/type.css');
  const cta = html.match(/<a[^>]*class="button button--primary promo-swiss__cta"[\s\S]*?<\/a>/)?.[0] ?? '';
  assert.match(cta, /<svg\b/);
  assert.match(cta, /href="\/booking\/"/, 'the promo CTA opens the booking flow');
  assert.doesNotMatch(html, /prototype-link--disabled|aria-disabled="true"/);
  assert.doesNotMatch(styles, /\.prototype-link--disabled/);
});

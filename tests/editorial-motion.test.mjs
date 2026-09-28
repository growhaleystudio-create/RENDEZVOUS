import test from 'node:test';
import assert from 'node:assert/strict';

test('hero scroll progress stays bounded and reverses with native scrolling', async () => {
  const { heroProgress } = await import('../src/scripts/editorial-motion.js');
  assert.equal(heroProgress(100, 1000), 0);
  assert.equal(heroProgress(-500, 1000), .5);
  assert.equal(heroProgress(-2000, 1000), 1);
  assert.equal(heroProgress(0, 0), 0);
});

test('reduced motion does not initialize reveals or scroll listeners', async () => {
  const { initEditorialMotion } = await import('../src/scripts/editorial-motion.js');
  let reads = 0;
  const cleanup = initEditorialMotion({ querySelector: () => { reads++; } }, {
    matchMedia: () => ({ matches: true }),
  });
  assert.equal(reads, 0);
  assert.equal(typeof cleanup, 'function');
  cleanup();
});

function harness({ targets, heroRect = { top: -2000, height: 1000, bottom: -1000 }, innerHeight = 900 }) {
  const listeners = new Map();
  const properties = new Map();
  const observers = [];
  const hero = {
    dataset: {},
    style: { setProperty: (key, value) => properties.set(key, value), removeProperty: key => properties.delete(key) },
    getBoundingClientRect: () => heroRect,
  };
  const events = {
    addEventListener: (name, fn) => listeners.set(name, fn),
    removeEventListener: name => listeners.delete(name),
  };
  const win = {
    ...events, innerHeight,
    matchMedia: () => ({ matches: false, ...events }),
    cancelAnimationFrame: () => {},
    requestAnimationFrame: () => 1,
    IntersectionObserver: class {
      constructor(callback, options) { this.callback = callback; this.options = options; this.targets = []; this.disconnected = false; observers.push(this); }
      observe(target) { this.targets.push(target); }
      unobserve(target) { this.targets = this.targets.filter(t => t !== target); }
      disconnect() { this.disconnected = true; }
    },
  };
  const doc = {
    ...events, hidden: false,
    querySelector: () => hero,
    querySelectorAll: selector => selector.includes('data-reveal') ? targets.filter(t => t.dataset.reveal === 'pending') : targets,
  };
  return { win, doc, hero, listeners, properties, observers };
}

function makeTarget(top, section = null) {
  const plays = [];
  const target = {
    dataset: {},
    getBoundingClientRect: () => ({ top, height: 300 }),
    contains: node => node === target,
    closest: selector => (selector.includes('section') ? section : target),
    animate(frames, options) {
      const animation = { frames, options, effect: { target }, finished: false, finish() { this.finished = true; }, cancel() {} };
      plays.push(animation);
      return animation;
    },
  };
  return { target, plays };
}

test('content already on screen is never touched; below-fold content waits for the reading area', async () => {
  const { initEditorialMotion, REVEAL_ROOT_MARGIN } = await import('../src/scripts/editorial-motion.js');
  const onScreen = makeTarget(200);
  const heading = makeTarget(1600);
  const card = makeTarget(1900);
  const { win, doc, observers } = harness({ targets: [onScreen.target, heading.target, card.target] });
  const cleanup = initEditorialMotion(doc, win);
  assert.equal(onScreen.target.dataset.reveal, undefined, 'visible content must not move or dim');
  assert.equal(heading.target.dataset.reveal, 'pending');
  assert.deepEqual(observers[0].targets, [heading.target, card.target]);
  assert.equal(REVEAL_ROOT_MARGIN, '0px 0px -20% 0px', 'motion plays once content reaches 80% of the viewport');
  assert.equal(observers[0].options.rootMargin, REVEAL_ROOT_MARGIN);
  cleanup();
});

test('only content that can never reach the reading line uses the visibility fallback', async () => {
  const { initEditorialMotion } = await import('../src/scripts/editorial-motion.js');
  const middle = makeTarget(1600);
  const pageEnd = makeTarget(4950);
  const { win, doc, observers } = harness({ targets: [middle.target, pageEnd.target] });
  doc.documentElement = { scrollHeight: 5000 };
  win.scrollY = 0;
  const cleanup = initEditorialMotion(doc, win);
  const [, fallback] = observers;
  assert.deepEqual(fallback.targets, [pageEnd.target], 'small content mid-page must not trigger early');
  fallback.callback([{ target: pageEnd.target, isIntersecting: true, intersectionRatio: .95 }]);
  assert.equal(pageEnd.plays.length, 1);
  cleanup();
});

test('entering content fades in and rises across the whole duration, staggered, without a delay jump', async () => {
  const { initEditorialMotion } = await import('../src/scripts/editorial-motion.js');
  const { MOTION } = await import('../src/scripts/motion-tokens.js');
  const a = makeTarget(1600);
  const b = makeTarget(1700);
  const { win, doc, observers } = harness({ targets: [a.target, b.target] });
  const cleanup = initEditorialMotion(doc, win);
  observers[0].callback([{ target: a.target, isIntersecting: false }]);
  assert.equal(a.plays.length, 0, 'nothing moves before it is in the reading area');
  observers[0].callback([{ target: a.target, isIntersecting: true }, { target: b.target, isIntersecting: true }]);
  observers[0].callback([{ target: a.target, isIntersecting: true }]);
  assert.equal(a.plays.length, 1, 'reveal plays once');
  const [first] = a.plays;
  const [second] = b.plays;
  assert.deepEqual(first.frames[0], { opacity: 0, translate: `0 ${MOTION.revealDistancePx}px` }, 'never-seen content fades in');
  assert.equal(first.frames[0].clipPath, undefined, 'content is never masked');
  assert.equal(first.options.fill, 'backwards', 'offset holds during the delay instead of jumping');
  assert.equal(first.options.easing, MOTION.easeReveal);
  assert.notEqual(MOTION.easeReveal, MOTION.easeOut, 'reveal must not reuse the front-loaded UI curve');
  assert.equal(first.options.duration, MOTION.revealMs);
  assert.equal(second.options.delay, MOTION.staggerMs, 'content arriving together follows in document order');
  assert.equal(a.target.dataset.reveal, undefined);
  cleanup();
});

test('focus settles a lowered element and reduced-motion changes clean everything up', async () => {
  const { initEditorialMotion } = await import('../src/scripts/editorial-motion.js');
  const below = makeTarget(1600);
  const { win, doc, hero, listeners, properties, observers } = harness({ targets: [below.target] });
  initEditorialMotion(doc, win);
  listeners.get('focusin')({ target: below.target });
  assert.equal(below.target.dataset.reveal, undefined, 'keyboard focus never lands on hidden content');
  assert.equal(properties.get('--hero-progress'), '1.0000');
  listeners.get('change')({ matches: true });
  assert.equal(observers[0].disconnected, true);
  assert.equal(properties.size, 0);
  assert.equal(hero.dataset.editorialMotion, undefined);
});

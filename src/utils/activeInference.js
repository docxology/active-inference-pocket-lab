/**
 * @file activeInference.js — Lightweight numerical core
 * @description Pure functions implementing the discrete-state equations that
 * the Vision and Core streams visualise. Kept dependency-free and side-
 * effect-free so they are trivial to test.
 *
 * Coverage:
 *  - Gaussian arithmetic: Bayesian product of two Gaussians, surprise, KL.
 *  - Categorical utilities: softmax, log-softmax, entropy.
 *  - POMDP helpers: sample from A/B, score Expected Free Energy for a policy.
 *  - Free-energy landscapes: analytic 2-D scalar fields used by visualisations.
 *
 * @module utils/activeInference
 */

/* ──────────────────────────── Gaussian core ─────────────────────────── */

/**
 * Safe natural logarithm.
 * @param {number} x
 */
export const safeLog = (x) => Math.log(Math.max(x, 1e-12));

/**
 * Product of two 1-D Gaussians, expressed in precision form.
 * Returns the posterior mean and precision.
 * @param {number} muA
 * @param {number} piA - precision of A
 * @param {number} muB
 * @param {number} piB - precision of B
 * @returns {{mu: number, pi: number}}
 */
export function gaussianProduct(muA, piA, muB, piB) {
  const pi = piA + piB;
  const mu = (piA * muA + piB * muB) / Math.max(pi, 1e-12);
  return { mu, pi };
}

/**
 * Gaussian log-probability at x given mean μ and precision π.
 */
export function gaussianLogPdf(x, mu, pi) {
  const variance = 1 / Math.max(pi, 1e-9);
  return -0.5 * Math.log(2 * Math.PI * variance) - 0.5 * pi * (x - mu) ** 2;
}

/**
 * Surprise under a Gaussian model: −ln p(o | μ, π).
 */
export function gaussianSurprise(o, mu, pi) {
  return -gaussianLogPdf(o, mu, pi);
}

/**
 * KL divergence between two 1-D Gaussians.
 */
export function gaussianKL(muQ, piQ, muP, piP) {
  const varQ = 1 / Math.max(piQ, 1e-9);
  const varP = 1 / Math.max(piP, 1e-9);
  return 0.5 * (Math.log(varP / varQ) + (varQ + (muQ - muP) ** 2) / varP - 1);
}

/**
 * Variational free energy for a Gaussian q approximating the posterior of a
 * Gaussian model with prior N(μₚ, πₚ) and likelihood N(o | μ=s, π=π_o). This
 * is the derivation the Core stream walks through.
 *
 * @param {number} muQ - approximate posterior mean
 * @param {number} piQ - approximate posterior precision
 * @param {number} o - observation
 * @param {number} muP - prior mean
 * @param {number} piP - prior precision
 * @param {number} piO - likelihood precision
 * @returns {{F: number, kl: number, accuracy: number}}
 */
export function gaussianFreeEnergy(muQ, piQ, o, muP, piP, piO) {
  const kl = gaussianKL(muQ, piQ, muP, piP);
  const accuracy = gaussianLogPdf(o, muQ, piO); // E_q approximated at mode
  return { F: kl - accuracy, kl, accuracy };
}

/* ─────────────────────────── Categorical utils ──────────────────────── */

/**
 * Numerically stable softmax.
 * @param {number[]} xs
 * @returns {number[]}
 */
export function softmax(xs) {
  const m = Math.max(...xs);
  const exps = xs.map((x) => Math.exp(x - m));
  const sum = exps.reduce((a, b) => a + b, 0) || 1;
  return exps.map((e) => e / sum);
}

/**
 * Shannon entropy of a discrete distribution (natural log).
 * @param {number[]} p
 */
export function entropy(p) {
  return -p.reduce((s, pi) => s + (pi > 0 ? pi * Math.log(pi) : 0), 0);
}

/**
 * KL divergence KL[q ∥ p] for discrete vectors.
 */
export function categoricalKL(q, p) {
  return q.reduce(
    (s, qi, i) => (qi > 0 ? s + qi * (Math.log(qi) - Math.log(Math.max(p[i], 1e-12))) : s),
    0,
  );
}

/* ──────────────────────────── POMDP toy core ────────────────────────── */

/**
 * Expected free energy for a single policy step in a 1-hot POMDP.
 *
 * @param {number[][]} A - A[o][s] likelihood
 * @param {number[][]} B - B[s'][s] transition under this action
 * @param {number[]} q - current belief over states
 * @param {number[]} C - log-preference over observations
 * @returns {{G: number, ambiguity: number, risk: number}}
 */
export function expectedFreeEnergyStep(A, B, q, C) {
  const S = q.length;
  const O = A.length;
  // Predicted state distribution after the action.
  const qNext = Array(S).fill(0);
  for (let sp = 0; sp < S; sp++) {
    for (let s = 0; s < S; s++) qNext[sp] += (B[sp][s] || 0) * q[s];
  }
  // Predicted observation distribution.
  const qo = Array(O).fill(0);
  for (let o = 0; o < O; o++) {
    for (let s = 0; s < S; s++) qo[o] += (A[o][s] || 0) * qNext[s];
  }
  // Ambiguity: E_{q(s')}[H[p(o|s')]]
  let ambiguity = 0;
  for (let s = 0; s < S; s++) {
    const col = A.map((row) => row[s]);
    ambiguity += qNext[s] * entropy(col);
  }
  // Risk: KL(q(o) || softmax(C))
  const pref = softmax(C);
  const risk = categoricalKL(qo, pref);
  return { G: ambiguity + risk, ambiguity, risk, qNext, qo };
}

/* ────────────────────── 2-D free-energy landscapes ──────────────────── */

/**
 * Build a 2-D free-energy grid used by the High-Road VisionStream.
 * The surface is a Gaussian well centred at the preferred state.
 *
 * @param {Object} opts
 * @param {number} [opts.size=40] - grid resolution
 * @param {number} [opts.muX=0.5] - attractor x (0..1)
 * @param {number} [opts.muY=0.5] - attractor y (0..1)
 * @param {number} [opts.spread=0.25] - width of the well
 * @returns {number[][]}
 */
export function makeFreeEnergyField({ size = 40, muX = 0.5, muY = 0.5, spread = 0.25 } = {}) {
  const grid = Array.from({ length: size }, () => new Array(size).fill(0));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / (size - 1);
      const ny = y / (size - 1);
      const d2 = (nx - muX) ** 2 + (ny - muY) ** 2;
      // Free energy: quadratic well + small ridge — creates visible gradient.
      grid[y][x] =
        d2 / (2 * spread * spread) + 0.15 * Math.sin(6 * Math.PI * nx) * Math.cos(6 * Math.PI * ny);
    }
  }
  return grid;
}

/**
 * Gradient descent step on a free-energy field with optional stochastic noise.
 * Returns the next (x, y) in [0, 1]².
 */
export function gradientStep(field, x, y, { step = 0.02, noise = 0 } = {}) {
  const size = field.length;
  const gx =
    (sampleField(field, Math.min(1, x + 0.02), y) - sampleField(field, Math.max(0, x - 0.02), y)) /
    0.04;
  const gy =
    (sampleField(field, x, Math.min(1, y + 0.02)) - sampleField(field, x, Math.max(0, y - 0.02))) /
    0.04;
  const nx = Math.min(1, Math.max(0, x - step * gx + (Math.random() - 0.5) * noise));
  const ny = Math.min(1, Math.max(0, y - step * gy + (Math.random() - 0.5) * noise));
  return { x: nx, y: ny, gx, gy, size };
}

/**
 * Bilinear-sampled field value at (x, y) in [0,1]².
 */
export function sampleField(field, x, y) {
  const size = field.length;
  const fx = x * (size - 1);
  const fy = y * (size - 1);
  const x0 = Math.max(0, Math.min(size - 1, Math.floor(fx)));
  const y0 = Math.max(0, Math.min(size - 1, Math.floor(fy)));
  const x1 = Math.min(size - 1, x0 + 1);
  const y1 = Math.min(size - 1, y0 + 1);
  const tx = fx - x0;
  const ty = fy - y0;
  const v00 = field[y0][x0];
  const v10 = field[y0][x1];
  const v01 = field[y1][x0];
  const v11 = field[y1][x1];
  return v00 * (1 - tx) * (1 - ty) + v10 * tx * (1 - ty) + v01 * (1 - tx) * ty + v11 * tx * ty;
}

/* ─────────────────────────── Small helpers ──────────────────────────── */

/**
 * Clamp to [lo, hi].
 */
export const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

/**
 * Linearly map `v` ∈ [a, b] into [c, d].
 */
export const lerpRange = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c);

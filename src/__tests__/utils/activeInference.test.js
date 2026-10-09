import { describe, it, expect } from 'vitest';
import {
  gaussianProduct,
  gaussianFreeEnergy,
  gaussianSurprise,
  gaussianKL,
  softmax,
  entropy,
  categoricalKL,
  expectedFreeEnergyStep,
  makeFreeEnergyField,
  sampleField,
  gradientStep,
} from '../../utils/activeInference';

describe('numerical identities', () => {
  it('computes a precision-weighted Gaussian posterior', () => {
    expect(gaussianProduct(0, 1, 6, 2)).toEqual({ mu: 4, pi: 3 });
  });
  it('makes free energy equal negative log evidence at the exact posterior', () => {
    const { mu, pi } = gaussianProduct(0, 1, 6, 2);
    const { F } = gaussianFreeEnergy(mu, pi, 6, 0, 1, 2);
    const surprise = gaussianSurprise(6, 0, 1 / (1 + 1 / 2));
    expect(F).toBeCloseTo(surprise, 10);
  });
  it('makes the free-energy gap exactly KL to the posterior away from the optimum', () => {
    const { F } = gaussianFreeEnergy(2, 4, 6, 0, 1, 2);
    const surprise = gaussianSurprise(6, 0, 2 / 3);
    expect(F - surprise).toBeCloseTo(gaussianKL(2, 4, 4, 3), 10);
  });
  it('does not clamp continuous negative log densities to zero', () => {
    expect(gaussianSurprise(0, 0, 100)).toBeLessThan(0);
  });
  it.each([0, -1, NaN, Infinity])('rejects invalid Gaussian precision %s', (pi) => {
    expect(() => gaussianLogCheck(pi)).toThrow(RangeError);
  });
  it('normalizes large logits without overflow', () => {
    expect(softmax([1000, 1000])).toEqual([0.5, 0.5]);
    expect(softmax([])).toEqual([]);
  });
  it('preserves infinite KL for impossible outcomes', () => {
    expect(categoricalKL([1, 0], [0, 1])).toBe(Infinity);
    expect(categoricalKL([0, 1], [0, 1])).toBe(0);
    expect(entropy([0.5, 0.5])).toBeCloseTo(Math.log(2));
  });
  it('decomposes categorical EFE with a normalized prediction', () => {
    const result = expectedFreeEnergyStep(
      [
        [1, 0],
        [0, 1],
      ],
      [
        [0, 1],
        [1, 0],
      ],
      [1, 0],
      [0, 0],
    );
    expect(result.qNext).toEqual([0, 1]);
    expect(result.qo).toEqual([0, 1]);
    expect(result.ambiguity).toBe(0);
    expect(result.G).toBeCloseTo(Math.log(2));
  });
  it('bilinearly interpolates and descends a real field', () => {
    expect(
      sampleField(
        [
          [0, 1],
          [1, 2],
        ],
        0.5,
        0.5,
      ),
    ).toBe(1);
    const field = makeFreeEnergyField();
    const next = gradientStep(field, 0.1, 0.1, { step: 0.001, noise: 0 });
    expect(sampleField(field, next.x, next.y)).toBeLessThan(sampleField(field, 0.1, 0.1));
  });
});

function gaussianLogCheck(pi) {
  return gaussianSurprise(0, 0, pi);
}

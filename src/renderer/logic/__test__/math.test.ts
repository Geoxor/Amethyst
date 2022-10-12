import { describe, it, expect } from 'vitest'
import { transformLogarithmic } from '../math';

describe('Math tests', () => {
  it('should return logarithmic values', () => {
    const initialValues = new Uint8Array([ 10, 70, 120, 175, 250 ]);
    const expected = new Uint8Array([ 1, 2, 4, 5, 5 ]);
    const result = transformLogarithmic(initialValues);
    expect(result).toEqual(expected);
  }) 
});

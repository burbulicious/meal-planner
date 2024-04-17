import { describe, it, expect } from 'vitest'
import { roundUpToNearestInteger } from '../calculations'

describe('roundUpToNearestInteger', () => {
  it('rounds up when decimal part is greater than or equal to 0.5', () => {
    expect(roundUpToNearestInteger(4.89)).toBe(5)
    expect(roundUpToNearestInteger(3.6)).toBe(4)
  })

  it('rounds down when decimal part is less than 0.5', () => {
    expect(roundUpToNearestInteger(3.4)).toBe(3)
    expect(roundUpToNearestInteger(2.11)).toBe(2)
  })

  it('returns zero for zero input', () => {
    expect(roundUpToNearestInteger(0)).toBe(0)
  })
})

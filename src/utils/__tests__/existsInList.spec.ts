import itemExists from '../existsInList'
import { describe, it, expect } from 'vitest'

describe('itemExists', () => {
  it('returns true when input string exists in the list string', () => {
    const inputString = 'apple'
    const listString = 'banana,apple,orange'
    expect(itemExists(inputString, listString)).toBe(true)
  })

  it('returns false when input string does not exist in the list string', () => {
    const inputString = 'grape'
    const listString = 'banana,apple,orange'
    expect(itemExists(inputString, listString)).toBe(false)
  })

  it('returns false when input string is empty', () => {
    const inputString = ''
    const listString = 'banana,apple,orange'
    expect(itemExists(inputString, listString)).toBe(false)
  })

  it('returns false when list string is empty', () => {
    const inputString = 'apple'
    const listString = ''
    expect(itemExists(inputString, listString)).toBe(false)
  })

  it('returns false when both input and list strings are empty', () => {
    const inputString = ''
    const listString = ''
    expect(itemExists(inputString, listString)).toBe(false)
  })

  it('ignores case sensitivity', () => {
    const inputString = 'apple'
    const listString = 'Banana,Apple,Orange'
    expect(itemExists(inputString, listString)).toBe(true)
  })

  it('trims whitespace in input string', () => {
    const inputString = '  apple  '
    const listString = 'banana,apple,orange'
    expect(itemExists(inputString, listString)).toBe(true)
  })
})

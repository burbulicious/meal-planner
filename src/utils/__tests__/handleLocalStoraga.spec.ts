import { storeDataInLocalStorage, getDataFromLocalStorage } from '../handleLocalStorage'
import { describe, it, expect } from 'vitest'

describe('storeDataInLocalStorage', () => {
  it('stores data in local storage successfully', () => {
    const data = { name: 'John', age: 30 }
    expect(storeDataInLocalStorage('testKey', data)).toBe(true)
    expect(localStorage.getItem('testKey')).toEqual(JSON.stringify(data))
  })

  it('returns false when data is empty', () => {
    expect(storeDataInLocalStorage('', {})).toBe(false)
    expect(storeDataInLocalStorage('testKey', null)).toBe(false)
  })
})

describe('getDataFromLocalStorage', () => {
  it('retrieves data from local storage successfully', () => {
    const data = { name: 'John', age: 30 }
    localStorage.setItem('testKey', JSON.stringify(data))
    expect(getDataFromLocalStorage('testKey')).toEqual(data)
  })

  it('handles invalid JSON data', () => {
    // Set invalid JSON data in localStorage
    localStorage.setItem('testKey', 'invalid-json')
    expect(getDataFromLocalStorage('testKey')).toBe(false)
  })
})

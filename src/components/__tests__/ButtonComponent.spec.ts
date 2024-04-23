import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ButtonComponent from '../ButtonComponent.vue'

describe('ButtonComponent', () => {
  it('renders button with default text and classes when no props are provided', () => {
    const wrapper = mount(ButtonComponent)
    expect(wrapper.find('button').text()).toBe('Generate meal plan')
    expect(wrapper.find('button').classes()).toContain('btn')
    expect(wrapper.find('button').classes()).toContain('btn__yellow')
  })

  it('renders button with provided text and classes', () => {
    const buttonText = 'Custom Button Text'
    const btnClasses = 'btn-custom'
    const wrapper = mount(ButtonComponent, {
      props: {
        buttonText,
        btnClasses
      }
    })

    expect(wrapper.find('button').text()).toBe(buttonText)
    expect(wrapper.find('button').classes()).toContain(btnClasses)
  })

  it('disables button when disabled prop is true', () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        disabled: true
      }
    })

    expect(wrapper.find('button').attributes('disabled')).toBe('')
  })

  it('enables button when disabled prop is false', () => {
    const wrapper = mount(ButtonComponent, {
      props: {
        disabled: false
      }
    })

    expect(wrapper.find('button').attributes('disabled')).toBe(undefined)
  })
})

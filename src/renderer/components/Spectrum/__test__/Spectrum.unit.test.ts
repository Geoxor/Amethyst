import Spectrum from '../Spectrum.vue';

import { describe, it } from 'vitest'
import { mount } from '@vue/test-utils';

// TODO: Fix this
describe.skip('Spectrum unit tests', () => {
  it('can render', () => {
    const wrapper = mount(Spectrum);
    expect(wrapper).toBeTruthy();
  })
}) 
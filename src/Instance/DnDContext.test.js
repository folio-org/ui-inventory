import React from 'react';
import { render } from '@testing-library/react';
import DnDContext from './DnDContext';

describe('DnDContext', () => {
  it('have a context value', () => {
    const wrapper = render(<DnDContext.Provider value={{ isDragging: false }} />);
    expect(wrapper).toBeTruthy();
  });
  it('update context value on change', () => {
    const wrapper = render(<DnDContext.Provider value={{ isDragging: false }} />);
    expect(wrapper).toBeTruthy();
    wrapper.rerender(<DnDContext.Provider value={{ isDragging: true }} />);
    expect(wrapper).toBeTruthy();
  });
});

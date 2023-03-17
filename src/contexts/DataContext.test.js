import React from 'react';
import { render } from '@testing-library/react';
import DataContext from './DataContext';

describe('DataContext', () => {
  it('renders correctly', () => {
    const { getByText } = render(<DataContext.Provider value={{ data: 'test data' }}><DataContext.Consumer>
      {({ data }) => <div>{data}</div>}</DataContext.Consumer></DataContext.Provider>
    );
    expect(getByText('test data')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, act } from '@testing-library/react';
import '../../test/jest/__mock__';
import InstancesView from './InstancesView';
import InstancesList from '../components/InstancesList';

jest.mock('../components/InstancesList', () => jest.fn(() => <div>Mocked InstancesList</div>));

describe('InstancesView', () => {
  it('InstancesView passes correct props to mocked InstancesList', () => {
    const data = { id: 1, name: 'Test' };
    const parentResources = { records: [], facets: {} };
    render(<InstancesView data={data} parentResources={parentResources} />);
    expect(InstancesList).toHaveBeenCalledWith({ data, parentResources }, expect.anything());
  });
  it('InstancesView re-renders when data prop changes', () => {
    const data1 = { id: 1, name: 'Test' };
    const data2 = { id: 2, name: 'Test 2' };
    const parentResources = { records: [], facets: {} };
    const { rerender } = render(<InstancesView data={data1} parentResources={parentResources} segment="all" />);
    act(() => {
      rerender(<InstancesView data={data2} parentResources={parentResources} segment="all" />);
    });
  });
  it('InstancesView re-renders when parentResources prop changes', () => {
    const data = { id: 1, name: 'Test' };
    const parentResources1 = { records: [], facets: {} };
    const parentResources2 = { records: [{ id:1, name:'Test' }], facets: { name:'test' } };
    const { rerender } = render(<InstancesView data={data} parentResources={parentResources1} segment="all" />);
    act(() => {
      rerender(<InstancesView data={data} parentResources={parentResources2} segment="all" />);
    });
  });
  it('InstancesView re-renders when segment prop changes', () => {
    const data = { id: 1, name: 'Test' };
    const parentResources = { records: [], facets: {} };
    const { rerender } = render(<InstancesView data={data} parentResources={parentResources} segment="all" />);
    act(() => {
      rerender(<InstancesView data={data} parentResources={parentResources} segment="active" />);
    });
  });
});

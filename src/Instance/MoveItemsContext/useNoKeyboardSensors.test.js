import { fireEvent } from '@testing-library/dom';
import { renderHook, act } from '@testing-library/react-hooks';
import useNoKeyboardSensors from './useNoKeyboardSensors';

const mockApi = {
  findClosestDraggableId: jest.fn(() => 'findClosestDraggableId'),
  canGetLock: jest.fn(),
  tryGetLock: () => ({
    abort: jest.fn()
  }),
  tryReleaseLock: () => 'tryReleaseLock'
};

const wrapper = ({ children }) => (
  <div>
    {children}
  </div>
);

describe('useNoKeyboardSensors', () => {
  it('should call findClosestDraggableId function from api', () => {
    renderHook(() => useNoKeyboardSensors(mockApi), { wrapper });

    act(() => {
      fireEvent.keyDown(window, { key: 'Spacebar', code: 'Spacebar' });
    });

    expect(mockApi.findClosestDraggableId).toBeCalled();
  });
});

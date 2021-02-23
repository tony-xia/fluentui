import { renderHook } from '@testing-library/react-hooks';
import { useEventCallback } from './useEventCallback';

describe('useEventCallback', () => {
  it('should not invalidate after rerender on unstable props', () => {
    // Arrange
    let unstableProp = [1, 1];
    const callback = () => unstableProp.reduce((acc, item) => acc + item, 0);

    // Act
    const { result, rerender } = renderHook(() => useEventCallback(callback, [unstableProp]));
    const firstRender = result.current;
    const firstRenderResult = firstRender();
    unstableProp = [1, 1, 1];
    rerender();
    const secondRender = result.current;
    const secondRenderResult = secondRender();

    // Assert
    expect(firstRender).toBe(secondRender);
    expect(firstRenderResult).toBe(2);
    expect(secondRenderResult).toBe(3);
  });

  it('should not invalidate after rerender on unstable callback', () => {
    // Arrange
    const prop = [1, 1];
    let unstableCallback = () => prop.reduce((acc, item) => acc + item, 0);

    // Act
    const { result, rerender } = renderHook(() => useEventCallback(unstableCallback, [prop]));
    const firstRender = result.current;
    const firstRenderResult = firstRender();
    unstableCallback = () => prop.reduce((acc, item) => (acc + item) * 0, 0);
    rerender();
    const secondRender = result.current;
    const secondRenderResult = secondRender();

    // Assert
    expect(firstRender).toBe(secondRender);
    expect(firstRenderResult).toBe(2);
    expect(secondRenderResult).toBe(0);
  });
});
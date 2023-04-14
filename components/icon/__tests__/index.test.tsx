import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import Icon from '..';
import { render } from '../../../tests/utils';

// v3 兼容性测试
describe('Icon', () => {
  it('should not render Icon', () => {
    const { container } = render(<Icon />);
    expect(container.firstChild).toBe(null);
  });

  it('should throw Error', () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Icon />);
    expect(errSpy).toHaveBeenCalledWith('Warning: [antd: Icon] Empty Icon');
    errSpy.mockRestore();
  });
});

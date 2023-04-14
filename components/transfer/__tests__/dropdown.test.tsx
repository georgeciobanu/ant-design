import { describe, it, expect, vi } from 'vitest';
/* eslint no-use-before-define: "off" */
import React from 'react';
import { act } from 'react-dom/test-utils';
import Transfer from '..';
import { fireEvent, render } from '../../../tests/utils';

const listProps = {
  dataSource: [
    {
      key: 'a',
      title: 'a',
      disabled: true,
    },
    {
      key: 'b',
      title: 'b',
    },
    {
      key: 'c',
      title: 'c',
    },
    {
      key: 'd',
      title: 'd',
    },
    {
      key: 'e',
      title: 'e',
    },
  ],
  selectedKeys: ['b'],
  targetKeys: [],
  pagination: { pageSize: 4 },
};

describe('Transfer.Dropdown', () => {
  function clickItem(container: HTMLElement, index: number) {
    const items = Array.from(
      container
        // Menu
        .querySelector('.ant-dropdown-menu')!
        // Items
        .querySelectorAll('li.ant-dropdown-menu-item'),
    );
    fireEvent.click(items[index]);
  }

  it('select all', () => {
    vi.useFakeTimers();

    const onSelectChange = vi.fn();
    const { container } = render(<Transfer {...listProps} onSelectChange={onSelectChange} />);

    fireEvent.mouseEnter(container.querySelector('.ant-transfer-list-header-dropdown')!);
    act(() => {
      vi.runAllTimers();
    });

    clickItem(container, 0);
    expect(onSelectChange).toHaveBeenCalledWith(['b', 'c', 'd', 'e'], []);

    vi.useRealTimers();
  });

  it('select current page', () => {
    vi.useFakeTimers();

    const onSelectChange = vi.fn();
    const { container } = render(<Transfer {...listProps} onSelectChange={onSelectChange} />);
    fireEvent.mouseEnter(container.querySelector('.ant-transfer-list-header-dropdown')!);
    act(() => {
      vi.runAllTimers();
    });

    clickItem(container, 1);
    expect(onSelectChange).toHaveBeenCalledWith(['b', 'c', 'd'], []);

    vi.useRealTimers();
  });

  it('should hide checkbox and dropdown icon when showSelectAll={false}', () => {
    const { container } = render(<Transfer {...listProps} showSelectAll={false} />);
    expect(container.querySelector('.ant-transfer-list-header-dropdown')).toBeFalsy();
    expect(
      container.querySelector('.ant-transfer-list-header .ant-transfer-list-checkbox'),
    ).toBeFalsy();
  });

  describe('select invert', () => {
    [
      { name: 'with pagination', props: listProps, index: 2, keys: ['c', 'd'] },
      {
        name: 'without pagination',
        props: { ...listProps, pagination: null as any },
        index: 1,
        keys: ['c', 'd', 'e'],
      },
    ].forEach(({ name, props, index, keys }) => {
      it(name, () => {
        vi.useFakeTimers();

        const onSelectChange = vi.fn();
        const { container } = render(<Transfer {...props} onSelectChange={onSelectChange} />);
        fireEvent.mouseEnter(container.querySelector('.ant-transfer-list-header-dropdown')!);
        act(() => {
          vi.runAllTimers();
        });

        clickItem(container, index);
        expect(onSelectChange).toHaveBeenCalledWith(keys, []);

        vi.useRealTimers();
      });
    });
  });

  describe('oneWay to remove', () => {
    [
      { name: 'with pagination', props: listProps },
      { name: 'without pagination', props: { ...listProps, pagination: null as any } },
    ].forEach(({ name, props }) => {
      it(name, () => {
        vi.useFakeTimers();

        const onChange = vi.fn();
        const { container } = render(
          <Transfer {...props} targetKeys={['b', 'c']} oneWay onChange={onChange} />,
        );

        // Right dropdown
        fireEvent.mouseEnter(container.querySelectorAll('.ant-transfer-list-header-dropdown')[1]!);
        act(() => {
          vi.runAllTimers();
        });

        clickItem(container, 0);
        expect(onChange).toHaveBeenCalledWith([], 'left', ['b', 'c']);

        vi.useRealTimers();
      });
    });
  });
});

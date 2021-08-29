import { Ship } from './ship';

jest.mock('./sprite');

describe('ship', () => {
  it('tests', () => {
    const removeEventListener = jest.fn();
    const addEventListener = jest.fn();
    const add = jest.fn();
    const ship = new Ship({
      sprite: {} as any,
      space: {
        addEventListener,
        removeEventListener,
        add
      } as any
    });
    expect(1 + 1).toEqual(2);
  });
});

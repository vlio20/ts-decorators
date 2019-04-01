import {memoize} from './memoize';

describe('memozie', () => {
  it('should verify memoize caching original method', (done) => {
    class T {
      prop: 3;

      @memoize<number>(10)
      foo(x: number, y: number): number {
        return this.goo(x, y);
      }

      goo(x: number, y: number): number {
        expect(this.prop).toBe(3);

        return x + y;
      }
    }

    const t = new T();
    t.prop = 3;
    const spy = jest.spyOn(T.prototype, 'goo');
    const resp1 = t.foo(1, 2);
    const resp2 = t.foo(1, 2);
    const resp_1 = t.foo(1, 3);

    expect(spy).toBeCalledTimes(2);
    expect(spy.mock.calls[0][0]).toBe(1);
    expect(spy.mock.calls[0][1]).toBe(2);
    expect(spy.mock.calls[1][0]).toBe(1);
    expect(spy.mock.calls[1][1]).toBe(3);

    setTimeout(async () => {
      const resp3 = t.foo(1, 2);

      expect(spy).toBeCalledTimes(3);
      expect(resp1).toBe(3);
      expect(resp2).toBe(3);
      expect(resp3).toBe(3);
      expect(resp_1).toBe(4);
      done();
    }, 20);
  });

  it('should make sure error thrown when decorator not set on method', () => {
    try {
      const nonValidMemoize: any = memoize<string>(50);

      class T {
        @nonValidMemoize
        boo: string;
      }
    } catch (e) {
      expect('@memoize is applicable only on a methods.').toBe(e.message);
    }
  });

  it('should use provided cache', (done) => {
    const cache = new Map<string, number>();

    class T {
      @memoize<number>({expirationTimeMs: 30, cache})
      foo(): number {
        return this.goo();
      }

      goo(): number {
        return 1;
      }
    }

    const spy = jest.spyOn(T.prototype, 'goo');

    const t = new T();
    t.foo();

    setTimeout(() => {
      t.foo();
      expect(spy).toHaveBeenCalledTimes(1);

      cache.delete('[]');
      t.foo();
      expect(spy).toHaveBeenCalledTimes(2);
      done();
    }, 10);
  });

  it('should verify memoize key mapper', async () => {
    const mapper = jest.fn((x: string, y: string) => {
      return `${x}_${y}`;
    });

    class T {
      @memoize<string>({expirationTimeMs: 10, keyResolver: mapper})
      fooWithMapper(x: string, y: string): string {
        return this.goo(x, y);
      }

      goo(x: string, y: string): string {
        return x + y;
      }
    }

    const t = new T();
    const spyFooWithMapper = jest.spyOn(T.prototype, 'goo');

    t.fooWithMapper('x', 'y');
    t.fooWithMapper('x', 'y');

    expect(mapper.mock.calls.length).toBe(2);
    expect(spyFooWithMapper).toHaveBeenCalledTimes(1);
    expect(spyFooWithMapper).toHaveBeenCalledWith('x', 'y');
  });
});

import {refreshable} from './refreshable';

describe('refreshable', () => {
  it('should populate refreshable property', (done) => {
    let fooCtr = 0;
    let gooCtr = 0;

    const foo = () => {
      return fooCtr++;
    };

    const goo = () => {
      return gooCtr++;
    };

    let fooDec = refreshable<any, number>({
      dataProvider: foo,
      intervalMs: 10
    });

    const gooDec = refreshable<any, number>({
      dataProvider: goo,
      intervalMs: 10
    });

    const t = <{prop: number, proop: number}>{prop: 9, proop: 4};
    fooDec(t, 'prop');
    gooDec(t, 'proop');

    setTimeout(() => {
      expect(t.prop).toBe(0);
      expect(t.proop).toBe(0);
    }, 5);

    setTimeout(() => {
      expect(t.prop).toBe(1);
      expect(t.proop).toBe(1);
      t.prop = null;

      setTimeout(() => {
        expect(t.prop).toBe(1);
        expect(t.proop).toBe(2);

        done();
      }, 10)
    }, 15);
  });
});

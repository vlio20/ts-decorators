import {refreshable} from './refreshable';
import {sleep} from '../common/test-utils';

describe('refreshable', () => {
  it('should populate refreshable property', async (done) => {
    let fooCtr = 0;
    let gooCtr = 0;

    const foo = () => {
      return fooCtr++;
    };

    const goo = () => {
      return gooCtr++;
    };

    const fooDec = refreshable<any, number>({
      dataProvider: foo,
      intervalMs: 50
    });

    const gooDec = refreshable<any, number>({
      dataProvider: goo,
      intervalMs: 50
    });

    const t = <{prop: number, proop: number}>{prop: 9, proop: 4};
    fooDec(t, 'prop');
    gooDec(t, 'proop');

    await sleep(10);

    expect(t.prop).toBe(0);
    expect(t.proop).toBe(0);

    await sleep(60);

    expect(t.prop).toBe(1);
    expect(t.proop).toBe(1);
    t.prop = null;
    t.proop = 100;

    await sleep(50);

    expect(t.prop).toBe(1);
    expect(t.proop).toBe(2);

    done();
  });
});

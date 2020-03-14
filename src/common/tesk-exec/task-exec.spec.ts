import {TaskExec} from './task-exec';
import {sleep} from '../test-utils';

describe('utils', () => {
  it('should verify task executed in time - A:40, B:20 -> B, A', async (done) => {
    const runner = new TaskExec();
    let val = '';
    const funA = jest.fn().mockImplementation(() => val += 'A');
    const funB = jest.fn().mockImplementation(() => val += 'B');

    runner.exec(funA, 50);
    await sleep(10);
    expect(funA).not.toBeCalled();
    runner.exec(funB, 20);
    await sleep(10);
    expect(funA).not.toHaveBeenCalled();
    expect(funB).not.toHaveBeenCalled();
    await sleep(15);
    expect(funA).not.toHaveBeenCalled();
    expect(funB).toBeCalledTimes(1);
    await sleep(20);
    expect(funA).toBeCalledTimes(1);
    expect(funB).toBeCalledTimes(1);
    expect(val).toBe('BA');
    done();
  });

  it('should verify task executed in time - A:20, B:40 -> A, B', async (done) => {
    const runner = new TaskExec();
    let val = '';
    const funA = jest.fn().mockImplementation(() => val += 'A');
    const funB = jest.fn().mockImplementation(() => val += 'B');

    runner.exec(funA, 20);
    runner.exec(funB, 40);
    await sleep(10);
    expect(funA).not.toBeCalled();
    expect(funB).not.toBeCalled();
    await sleep(20);
    expect(funA).toBeCalled();
    expect(funB).not.toHaveBeenCalled();
    await sleep(20);
    expect(funA).toBeCalledTimes(1);
    expect(funB).toBeCalledTimes(1);
    expect(val).toBe('AB');
    done();
  });

  it('should verify task executed in time -  - A:20, B:20, C:10 -> A, B, C', async (done) => {
    const runner = new TaskExec();
    const funA = jest.fn();
    const funB = jest.fn();
    const funC = jest.fn();

    runner.exec(funA, 20);
    runner.exec(funB, 20);
    await sleep(10);
    expect(funA).not.toHaveBeenCalled();
    expect(funB).not.toHaveBeenCalled();
    runner.exec(funC, 10);
    await sleep(15);
    expect(funA).toBeCalledTimes(1);
    expect(funB).toBeCalledTimes(1);
    expect(funC).toBeCalledTimes(1);
    done();
  });
});

import { ScrollStoryController } from '../components/animation/ScrollStoryController';
import { Seekable } from '../types';

// a minimal seekable plot recording the indices it was driven to
class FakePlot implements Seekable {
  indices: number[] = [];

  animateTo(index: number) {
    this.indices.push(index);
    return this;
  }
}

describe('ScrollStoryController', () => {
  test('seek drives all plots to the requested index', () => {
    const a = new FakePlot();
    const b = new FakePlot();
    const controller = new ScrollStoryController([a, b]);

    controller.seek(0);
    controller.seek(2);

    expect(a.indices).toEqual([0, 2]);
    expect(b.indices).toEqual([0, 2]);
    expect(controller.getCurrentIndex()).toBe(2);
  });

  test('repeated seeks to the same index are ignored', () => {
    const plot = new FakePlot();
    const controller = new ScrollStoryController([plot]);

    controller.seek(1);
    controller.seek(1);

    expect(plot.indices).toEqual([1]);
  });

  test('reset returns the plots to the initial state', () => {
    const plot = new FakePlot();
    const controller = new ScrollStoryController([plot]);

    controller.seek(3);
    controller.reset();

    expect(plot.indices).toEqual([3, -1]);
    expect(controller.getCurrentIndex()).toBeNull();

    // after a reset, seeking the first step again must not be ignored
    controller.seek(-1);
    expect(plot.indices).toEqual([3, -1, -1]);
  });
});

import { HumanizedTimePipe } from './humanized-time.pipe';

describe('HumanizedTimePipe', () => {
  it('create an instance', () => {
    const pipe = new HumanizedTimePipe();
    expect(pipe).toBeTruthy();
  });
});

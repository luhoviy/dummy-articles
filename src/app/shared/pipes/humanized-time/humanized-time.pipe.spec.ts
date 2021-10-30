import { HumanizedTimePipe } from './humanized-time.pipe';

describe('HumanizedTimePipe', () => {
  const pipe = new HumanizedTimePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should correctly humanize time', () => {
    const time = new Date(
      new Date().setMinutes(new Date().getMinutes() - 5)
    ).getTime();
    const expectedResult = '5 minutes ago';
    expect(pipe.transform(time)).toBe(expectedResult);
  });
});

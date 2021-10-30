import { FillEmptyPipe } from './fill-empty.pipe';

describe('FillEmptyPipe', () => {
  const pipe = new FillEmptyPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should replace empty values with desired text', () => {
    expect(pipe.transform(null)).toBe('Not specified');
  });
});

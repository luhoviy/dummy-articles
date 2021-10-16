import { UserAgePipe } from './user-age.pipe';

describe('UserAgePipe', () => {
  it('create an instance', () => {
    const pipe = new UserAgePipe();
    expect(pipe).toBeTruthy();
  });
});

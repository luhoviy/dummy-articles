import { UserAgePipe } from './user-age.pipe';

describe('UserAgePipe', () => {
  const pipe = new UserAgePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return correct user age', () => {
    const birthDate = new Date(
      new Date().setFullYear(new Date().getFullYear() - 20)
    ).toUTCString();
    const expectedResult = 20;
    expect(pipe.transform(birthDate)).toBe(expectedResult);
  });
});

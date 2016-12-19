import buildFixture from 'test/fixtures/build';

describe('e2e: simple', () => {
  it('test', function () {
    this.timeout(Infinity);

    return buildFixture('simple')
      .then((stats) => {
        console.log(stats.compilation.assets['fixture.js'].existsAt);
        return true;
      });
  });
});

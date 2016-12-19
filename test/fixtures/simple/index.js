import vrtest from 'vrtest/client';

const suite = vrtest.createSuite('simple');

suite.test('foo', () => {
  document.body.innerHTML = '<button>foo</button>';
});

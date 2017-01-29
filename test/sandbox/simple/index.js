import vrtest from 'vrtest/client';

const suite = vrtest.createSuite('simple');

suite.createTest('button', () => {
  document.body.innerHTML = '<button>foo</button>';
});

suite.createTest('heading', () => {
  document.body.innerHTML = '<h1>foo</h1>';
});

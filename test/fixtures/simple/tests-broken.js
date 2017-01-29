import vrtest from 'vrtest/client';

const suite = vrtest.createSuite('simple');

suite.createTest('button', () => {
  document.body.innerHTML = '<button>foo</button>';
});

suite.createTest('heading', () => {
  document.body.innerHTML = '<h1 style="background: red; color: white; display: inline-block; padding: 5px;">foo</h1>';
});

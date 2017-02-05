import vrtest from 'vrtest/client';

const suite = vrtest.createSuite('simple');

suite.createTest('button', () => {
  document.body.innerHTML = '<button href="#" style="border: none; font-family: Arial; font-size: 16px;">foo</button>';
});

suite.createTest('heading', () => {
  document.body.innerHTML = '<h1 style="font-family: Arial; background: blue; color: white; display: inline-block; padding: 5px;">foo</h1>';
});

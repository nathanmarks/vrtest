import vrtest from 'vrtest/client';
import webfontloader from 'webfontloader';

vrtest.before(() => {
  return new Promise((resolve) => {
    webfontloader.load({
      google: {
        families: [
          'Source+Sans+Pro:400,700',
        ],
      },
      timeout: 10000,
      active: () => {
        resolve('active');
      },
      inactive: () => {
        resolve('inactive');
      },
    });
  });
});

const suite = vrtest.createSuite('simple');

suite.createTest('button', () => {
  document.body.innerHTML = '<button href="#" style="border: none; font-family: \'Source Sans Pro\'; font-size: 16px;">foo</button>';
});

suite.createTest('heading', () => {
  document.body.innerHTML = '<h1 style="font-family: \'Source Sans Pro\'; background: red; color: white; display: inline-block; padding: 5px;">foo</h1>';
});

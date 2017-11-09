//jshint strict: false
module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/firebase/firebase.js',
      'bower_components/angularfire/dist/angularfire.js',
      'bower_components/mockfirebase/browser/mockfirebase.js',
      'bower_components/sinon/pkg/sinon.js',
      'bower_components/angular-file-saver/dist/angular-file-saver.bundle.min.js',
      '**/*.module.js',
      '*!(.module|.spec).js',
      '!(bower_components)/**/*!(.module|.spec).js',
      '**/*.spec.js',
    ],
    exclude: [
      'bower_components/angular-file-saver/src/*'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};

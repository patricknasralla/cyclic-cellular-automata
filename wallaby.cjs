module.exports = function () {
  process.env.NODE_ENV = 'test'
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  process.env.NODE_PATH = require('path').join(__dirname, '../../node_modules')

  process.env.TEST_ENV = 'wallaby'


  return {
    autoDetect: true,

    files: [
      'src/**/*.ts*',
      { pattern: 'public/**/*', instrument: false },
      { pattern: 'src/**/*.css', instrument: false },
      { pattern: 'src/**/fixtures/*', instrument: false },
      { pattern: 'src/config/*.js', instrument: false },
      { pattern: 'src/lib/*', instrument: false },
      '!src/**/*.test.js?(x)',
      '!src/**/*.test.ts?(x)',
    ],

    tests: [
      'src/**/*.test.ts?(x)',
    ],

    filesWithNoCoverageCalculated: [
      'src/index.js',
      'src/config/*.js',
    ],

    hints: {
      ignoreCoverage: /ignore coverage/,
    },

    runMode: 'onsave',

    delays: {
      run: 2000,
    },
  }
}

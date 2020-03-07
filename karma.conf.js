/* eslint-disable import/no-extraneous-dependencies */
const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'test/**/*.test.js', type: 'module' },
      ],

      client: {
        mocha: {
          ui: 'tdd',
        },
      },

      browserConsoleLogOptions: {
        level: config.logLevel,
      },

      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 98,
            branches: 88,
            functions: 100,
            lines: 98,
          },
        },
      },

      esm: {
        nodeResolve: true,
      },
    }),
  );

  return config;
};

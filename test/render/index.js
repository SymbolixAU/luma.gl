/* global window */
import test from 'tape-catch';
import {SnapshotTestRunner, PerformanceTestRunner} from '@luma.gl/test-utils';

import EXAMPLE_TEST_CASES from './example-test-cases';
import PERF_TEST_CASES from './performance-test-cases';

const renderTestCaseCount = EXAMPLE_TEST_CASES.length;
const perfTestCaseCount = PERF_TEST_CASES.length;

test('RenderTest', t => {
  // tape's default timeout is 500ms
  t.timeoutAfter(renderTestCaseCount * 2000);

  new SnapshotTestRunner({width: 600, height: 400})
    .add(EXAMPLE_TEST_CASES)
    .run({
      onTestStart: testCase => t.comment(testCase.name),
      onTestPass: (testCase, result) => t.pass(`match: ${result.matchPercentage}`),
      onTestFail: (testCase, result) => t.fail(result.error || `match: ${result.matchPercentage}`),

      imageDiffOptions: {
        // uncomment to save screenshot to disk
        // saveOnFail: true,
        // saveAs: '[name].png'
      }
    })
    .then(t.end);
});

test('PerformanceTest', t => {
  if (window.browserTestDriver_isHeadless) {
    t.comment('Performance test is not available in headless mode');
    t.end();
    return;
  }

  // tape's default timeout is 500ms
  t.timeoutAfter(perfTestCaseCount * 4000);

  const pixelRatio = window.devicePixelRatio || 1;

  // Mac full screen
  new PerformanceTestRunner({width: 3600 / pixelRatio, height: 2800 / pixelRatio})
    .add(PERF_TEST_CASES)
    .run({
      onTestStart: testCase => t.comment(testCase.name),
      onTestPass: (testCase, result) =>
        t.pass(`perf: ${result.framesRendered} frames at ${result.fps} fps`),
      onTestFail: (testCase, result) =>
        t.fail(`perf: ${result.framesRendered} frames at ${result.fps} fps`)
    })
    .then(t.end);
});

import { html, fixture, fixtureCleanup, assert } from '@open-wc/testing';
import sinon from 'sinon';
import { STYLESHEET_URI as DEFAULT_STYLESHEET_URI, ANSI_COLOR } from '../src/VisualLogger.js';
import '../visual-logger.js';

suite('<visual-logger>', () => {
  teardown(() => {
    fixtureCleanup();
  });

  suite('Settings', () => {
    test('renders a terminal with the settings configured in "cols", "rows", "lineHeight"', async () => {
      const settings = {
        cols: 2,
        rows: 10,
        lineHeight: 2,
      };

      const terminal = new window.Terminal();
      const terminalProto = Object.getPrototypeOf(terminal);
      const terminalOpenStub = sinon.stub(terminalProto, 'open');

      const el = await fixture(html`
        <visual-logger
          cols="${settings.cols}"
          rows="${settings.rows}"
          line-height="${settings.lineHeight}"
        ></visual-logger>
      `);

      await el.updateComplete;

      assert.isTrue(terminalOpenStub.calledWith(el), 'opens a terminal in its root');
      assert.instanceOf(el.terminal, terminalProto.constructor);

      Object.entries(settings).forEach(([setting, value]) => {
        assert.strictEqual(el.terminal.getOption(setting), value, `${setting} is ${value}`);
      });
    });

    test('injects terminal styles from CDN if "stylesheetUri" is not set', async () => {
      await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      const terminalStyles = document.querySelector('#xterm-styles');
      assert.strictEqual(terminalStyles.getAttribute('href'), DEFAULT_STYLESHEET_URI);
    });

    test('changing "cols" after initialization resizes the terminal', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );
      const resizeSpy = sinon.spy(el.terminal, 'resize');

      el.cols = 3;
      await el.updateComplete;

      const colsParam = resizeSpy.getCall(0).args[0];

      assert.strictEqual(colsParam, 3);
    });

    test('changing "rows" after initialization resizes the terminal', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );
      const resizeSpy = sinon.spy(el.terminal, 'resize');

      el.rows = 3;
      await el.updateComplete;

      const rowsParam = resizeSpy.getCall(0).args[1];

      assert.strictEqual(rowsParam, 3);
    });

    test('changing "lineHeight" after initialization updates the terminal "lineHeight"', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );
      const setOptionSpy = sinon.spy(el.terminal, 'setOption');

      el.lineHeight = 2;
      await el.updateComplete;

      assert.isTrue(setOptionSpy.calledWith('lineHeight', 2));
    });
  });

  suite('Methods', () => {
    test('"log()" logs a green message', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );
      const writelnSpy = sinon.spy(el.terminal, 'writeln');

      el.log('foo');

      const message = `${ANSI_COLOR.green}foo`;

      assert.isTrue(writelnSpy.calledWith(message));
    });

    test('"error()" logs a red message', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );
      const writelnSpy = sinon.spy(el.terminal, 'writeln');

      el.error('foo');

      const message = `${ANSI_COLOR.red}foo`;

      assert.isTrue(writelnSpy.calledWith(message));
    });

    test('"warn()" logs a yellow message', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );
      const writelnSpy = sinon.spy(el.terminal, 'writeln');

      el.warn('foo');

      const message = `${ANSI_COLOR.yellow}foo`;

      assert.isTrue(writelnSpy.calledWith(message));
    });

    test('"info()" logs a blue message', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );
      const writelnSpy = sinon.spy(el.terminal, 'writeln');

      el.info('foo');

      const message = `${ANSI_COLOR.blue}foo`;

      assert.isTrue(writelnSpy.calledWith(message));
    });

    test('"clear() clears the terminal', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );
      const resetSpy = sinon.spy(el.terminal, 'reset');

      el.clear();

      assert.isTrue(resetSpy.called);
    });
  });

  suite('Logging', () => {
    test('calling "console.log()" calls "log()" with the same params', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      // cannot spy on log method
      const writelnSpy = sinon.spy(el.terminal, 'writeln');

      console.log('first', 'second');
      const writelnSpyParam = writelnSpy.getCall(0).args[0];

      assert.include(writelnSpyParam, ANSI_COLOR.green);
      assert.include(writelnSpyParam, 'first');
      assert.include(writelnSpyParam, 'second');
    });

    test('calling "console.info()" calls "info()" with the same params', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      const writelnSpy = sinon.spy(el.terminal, 'writeln');

      console.info('first', 'second');
      const writelnSpyParam = writelnSpy.getCall(0).args[0];

      assert.include(writelnSpyParam, ANSI_COLOR.blue);
      assert.include(writelnSpyParam, 'first');
      assert.include(writelnSpyParam, 'second');
    });

    test('calling "console.warn()" calls "warn()" with the same params', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      const writelnSpy = sinon.spy(el.terminal, 'writeln');

      console.warn('first', 'second');
      const writelnSpyParam = writelnSpy.getCall(0).args[0];

      assert.include(writelnSpyParam, ANSI_COLOR.yellow);
      assert.include(writelnSpyParam, 'first');
      assert.include(writelnSpyParam, 'second');
    });

    test('calling "console.error()" calls "error()" with the same params', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      const writelnSpy = sinon.spy(el.terminal, 'writeln');

      console.error('first', 'second');
      const writelnSpyParam = writelnSpy.getCall(0).args[0];

      assert.include(writelnSpyParam, ANSI_COLOR.red);
      assert.include(writelnSpyParam, 'first');
      assert.include(writelnSpyParam, 'second');
    });

    test('calling a console method included in "excludedLogMethods" does not call the corresponding component method', async () => {
      const el = await fixture(
        // eslint-disable-next-line lit/attribute-value-entities
        html`
          <visual-logger excluded-log-methods='["log"]'></visual-logger>
        `,
      );

      const writelnSpy = sinon.spy(el.terminal, 'writeln');
      console.log('not logged');

      assert.isFalse(writelnSpy.called);
    });

    test('shows a character separator (‣) between the first and second log param', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      const writelnSpy = sinon.spy(el.terminal, 'writeln');
      console.log('first', 'second');
      const expectedMessage = `${ANSI_COLOR.green}first ‣ second`;

      assert.isTrue(writelnSpy.calledWith(expectedMessage));
    });

    test('param separator is not shown if console is called when one param', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      const writelnSpy = sinon.spy(el.terminal, 'writeln');
      console.log('first');
      const expectedMessage = `${ANSI_COLOR.green}first`;

      assert.isTrue(writelnSpy.calledWith(expectedMessage));
    });

    test('console[method] second param is shown if it is 0', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      const writelnSpy = sinon.spy(el.terminal, 'writeln');
      console.log('first', 0);
      const expectedMessage = `${ANSI_COLOR.green}first ‣ 0`;

      assert.isTrue(writelnSpy.calledWith(expectedMessage));
    });

    test('objects in second param are stringified', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      const writelnSpy = sinon.spy(el.terminal, 'writeln');
      const obj = { foo: 'bar' };
      console.log('first', obj);
      const expectedMessage = `${ANSI_COLOR.green}first ‣ {"foo":"bar"}`;

      assert.isTrue(writelnSpy.calledWith(expectedMessage));
    });

    test('arrays in second param are stringified', async () => {
      const el = await fixture(
        html`
          <visual-logger></visual-logger>
        `,
      );

      const writelnSpy = sinon.spy(el.terminal, 'writeln');
      const arr = ['uno', 'dos'];
      console.log('first', arr);
      const expectedMessage = `${ANSI_COLOR.green}first ‣ ["uno","dos"]`;

      assert.isTrue(writelnSpy.calledWith(expectedMessage));
    });
  });
});

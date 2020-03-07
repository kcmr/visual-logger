/* eslint-disable no-console */
import { html, LitElement } from 'lit-element';
import 'xterm';

const STYLESHEET_URI = 'https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css';
const ANSI_COLOR = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function format(param = '') {
  if (typeof param === 'object') {
    try {
      return JSON.stringify(param);
    } catch (error) {
      console.error(error);
    }
  }

  return param;
}

function getMessage(...args) {
  const [first, second] = args;
  return [first, format(second)].filter(Boolean).join(' ‣ ');
}

export class BrowserConsole extends LitElement {
  static get properties() {
    return {
      /**
       * Console columns
       */
      cols: {
        type: Number,
      },

      /**
       * Console rows
       */
      rows: {
        type: Number,
      },

      /**
       * Line height
       */
      lineHeight: {
        type: Number,
        attribute: 'line-height',
      },

      /**
       * Terminal theme
       * @see https://xtermjs.org/docs/api/terminal/interfaces/itheme/
       */
      theme: {
        type: Object,
        attribute: false,
      },

      /**
       * Enabled log methods (window.console)
       */
      logMethods: {
        type: Array,
        attribute: 'log-methods',
      },

      /**
       * Supress window.console logs
       */
      noConsole: {
        type: Boolean,
        attribute: 'no-console',
      },

      /**
       * URI of the Terminal stylesheet (Uses cdnjs if not provided)
       */
      stylesheetUri: {
        type: String,
        attribute: 'stylesheet-uri',
      },
    };
  }

  constructor() {
    super();
    this.cols = 200;
    this.rows = 5;
    this.lineHeight = 1.5;
    this.logMethods = ['log', 'info', 'warn', 'error'];
    this.stylesheetUri = STYLESHEET_URI;
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this._loadStyles();
    this._initialize();
  }

  _loadStyles() {
    const style = document.createElement('link');
    document.head.appendChild(
      Object.assign(style, {
        rel: 'stylesheet',
        href: this.stylesheetUri,
      }),
    );
  }

  _initialize() {
    this._terminal = new window.Terminal({
      cols: this.cols,
      rows: this.rows,
      lineHeight: this.lineHeight,
      theme: this.theme,
    });

    this._terminal.open(this);
    this._spyConsole();
  }

  _spyConsole() {
    const consoleEnabled = !this.noConsole;

    function logDecorator(fn, method) {
      return function log(...args) {
        method(...args);

        if (consoleEnabled) {
          fn.call(this, ...args);
        }
      };
    }

    this.logMethods.forEach(method => {
      const logMethod = this[method].bind(this);
      console[method] = logDecorator(console[method], logMethod);
    });
  }

  /**
   * Logs a message (console.log)
   */
  log(...args) {
    this._writeln('green', getMessage(...args));
  }

  /**
   * Logs an error (console.error)
   */
  error(...args) {
    this._writeln('red', getMessage(...args));
  }

  /**
   * Logs a warning (console.warn)
   */
  warn(...args) {
    this._writeln('yellow', getMessage(...args));
  }

  /**
   * Logs an info (console.info)
   */
  info(...args) {
    this._writeln('blue', getMessage(...args));
  }

  /**
   * Clears the console
   */
  clear() {
    this._terminal.reset();
  }

  _writeln(color, message) {
    this._terminal.writeln(`${ANSI_COLOR[color]}${message}`);
  }

  render() {
    return html`
      <style>
        browser-console {
          display: block;
          position: fixed;
          bottom: 0;
          width: 100%;
          box-sizing: border-box;
        }

        browser-console > div {
          padding: 10px;
        }

        browser-console code {
          font-family: monospace, monospace;
        }
      </style>
    `;
  }
}

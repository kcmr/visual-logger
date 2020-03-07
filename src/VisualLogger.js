/* eslint-disable no-console */
import { html, LitElement } from 'lit-element';
import 'xterm';

const LOG_METHODS = ['log', 'warn', 'info', 'error'];
export const STYLESHEET_URI = 'https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css';
export const ANSI_COLOR = {
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
  const notEmpty = value => Boolean(String(value));

  return [first, format(second)].filter(notEmpty).join(' ‣ ');
}

export class VisualLogger extends LitElement {
  static get properties() {
    return {
      /**
       * Terminal columns
       */
      cols: {
        type: Number,
      },

      /**
       * Terminal rows
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
       * Excluded log (window.console) methods
       */
      excludedLogMethods: {
        type: Array,
        attribute: 'excluded-log-methods',
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

  get terminal() {
    return this._terminal;
  }

  constructor() {
    super();
    this.cols = 200;
    this.rows = 5;
    this.lineHeight = 1.5;
    this.excludedLogMethods = [];
    this.stylesheetUri = STYLESHEET_URI;
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this._loadStyles();
    this._initialize();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this._updateTerminal(changedProperties);
  }

  _loadStyles() {
    const style = document.createElement('link');
    document.head.appendChild(
      Object.assign(style, {
        id: 'xterm-styles',
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

  _updateTerminal(changedProperties) {
    if (
      (changedProperties.has('cols') && this.cols !== undefined) ||
      (changedProperties.has('rows') && this.rows !== undefined)
    ) {
      this._terminal.resize(this.cols, this.rows);
    }

    if (changedProperties.has('lineHeight') && this.lineHeight !== undefined) {
      this._terminal.setOption('lineHeight', this.lineHeight);
    }
  }

  _spyConsole() {
    const consoleEnabled = !this.noConsole;
    const allowedLogMethods = LOG_METHODS.filter(
      method => !this.excludedLogMethods.includes(method),
    );

    function logDecorator(fn, method) {
      return function log(...args) {
        method(...args);

        if (consoleEnabled) {
          fn.call(this, ...args);
        }
      };
    }

    allowedLogMethods.forEach(method => {
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
        visual-logger {
          display: block;
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          box-sizing: border-box;
        }

        visual-logger > div {
          padding: 10px;
        }

        visual-logger code {
          font-family: monospace, monospace;
        }
      </style>
    `;
  }
}

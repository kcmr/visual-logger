import { BrowserConsole } from './src/BrowserConsole.js';

if (!window.customElements.get('browser-console')) {
  window.customElements.define('browser-console', BrowserConsole);
}

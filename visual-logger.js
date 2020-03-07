import { VisualLogger } from './src/VisualLogger.js';

if (!window.customElements.get('visual-logger')) {
  window.customElements.define('visual-logger', VisualLogger);
}

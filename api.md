# visual-logger

Browser UI terminal using Xterm.js to display console methods (log, warn, error, info).

## Properties

| Property             | Attribute              | Modifiers | Type      | Default                                          | Description                                      |
|----------------------|------------------------|-----------|-----------|--------------------------------------------------|--------------------------------------------------|
| `cols`               | `cols`                 |           | `number`  | 200                                              | Terminal columns                                 |
| `excludedLogMethods` | `excluded-log-methods` |           | `array`   | []                                               | Excluded log (window.console) methods            |
| `lineHeight`         | `line-height`          |           | `number`  | 1.5                                              | Line height                                      |
| `noConsole`          | `no-console`           |           | `boolean` |                                                  | Supress window.console logs                      |
| `rows`               | `rows`                 |           | `number`  | 5                                                | Terminal rows                                    |
| `stylesheetUri`      | `stylesheet-uri`       |           | `string`  | "https://cdnjs.cloudflare.com/ajax/libs/xterm/3.14.5/xterm.min.css" | URI of the Terminal stylesheet (Uses cdnjs if not provided) |
| `terminal`           |                        | readonly  |           |                                                  | Returns the xterm intance                        |
| `theme`              |                        |           | `object`  |                                                  | Terminal theme                                   |

## Methods

| Method             | Type                     | Description                   |
|--------------------|--------------------------|-------------------------------|
| `clear`            | `(): void`               | Clears the console            |
| `createRenderRoot` | `(): this`               |                               |
| `error`            | `(...args: any[]): void` | Logs an error (console.error) |
| `info`             | `(...args: any[]): void` | Logs an info (console.info)   |
| `log`              | `(...args: any[]): void` | Logs a message (console.log)  |
| `warn`             | `(...args: any[]): void` | Logs a warning (console.warn) |

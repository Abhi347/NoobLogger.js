/* eslint no-console:0 */
// tslint:disable: no-console
import colors, { Color } from 'colors';

export enum LogLevel {
  debug = 3,
  error = 0,
  info = 2,
  prod = -1,
  verbose = 4,
  warn = 1,
}

declare global {
  // tslint:disable-next-line: interface-name
  interface String {
    warn: string;
  }
}

export type DebugableError = Error & {
  debug?: string;
};

export interface IColorTheme {
  debug: Color;
  error: Color;
  info: Color;
  verbose: Color;
  warn: Color;
}

export interface ILogSettingsOptions {
  colorTheme: Partial<IColorTheme>;
  error: {
    force: boolean;
    level: LogLevel;
    showDebug: boolean;
    showStack: boolean;
  };
  logLevel: LogLevel; // verbose,debug, info, error, prod
}

const DEFAULT_OPTIONS: ILogSettingsOptions = {
  colorTheme: {
    debug: colors.white,
    error: colors.red,
    info: colors.green,
    verbose: colors.cyan,
    warn: colors.yellow,
  },
  error: {
    force: false,
    level: LogLevel.error,
    showDebug: true,
    showStack: false,
  },
  logLevel: LogLevel.debug,
};

export interface ILogOptions {
  level: LogLevel;
  stringify: boolean;
  force: boolean;
}

let loggingOptions: ILogSettingsOptions;
setDefault();

export function init(options: Partial<ILogSettingsOptions>) {
  if (options.logLevel) {
    loggingOptions.logLevel = options.logLevel;
  }
  if (options.error) {
    if (options.error.showStack) {
      loggingOptions.error.showStack = !!options.error.showStack;
    }
    if (options.error.showDebug) {
      loggingOptions.error.showDebug = !!options.error.showDebug;
    }
  }
  if (options.colorTheme) {
    loggingOptions.colorTheme = {
      ...loggingOptions.colorTheme,
      ...options.colorTheme,
    };
    colors.setTheme(loggingOptions.colorTheme);
  }
}

export function setDefault() {
  loggingOptions = DEFAULT_OPTIONS;
  colors.setTheme(loggingOptions.colorTheme);
}

export function setLogLevel(logLevel: LogLevel) {
  loggingOptions.logLevel = logLevel;
}

// region console loggers
export function checkLevel(level: LogLevel) {
  return level <= loggingOptions.logLevel;
}
function write(msg: object | string, options: Partial<ILogOptions>) {
  const defaultOptions: ILogOptions = {
    force: false,
    level: LogLevel.verbose,
    stringify: false,
  };
  const mergedOptions: ILogOptions & ILogSettingsOptions = {
    ...defaultOptions,
    ...loggingOptions,
    ...options,
  };
  if (mergedOptions.force || checkLevel(mergedOptions.level)) {
    if (mergedOptions.stringify) {
      msg = JSON.stringify(msg);
    }

    console.log(msg);
  }
}
export function error(
  err: string | DebugableError,
  options: Partial<ILogOptions> = {},
) {
  const mergedOptions = { ...DEFAULT_OPTIONS.error, ...options };
  if (mergedOptions.force || checkLevel(mergedOptions.level)) {
    if (typeof err === 'string') {
      console.error(err.red);
    } else {
      console.error(err);
      if (err.stack && mergedOptions.showStack) {
        console.log(err.stack.red);
      }
      if (err.debug && mergedOptions.showDebug) {
        console.log(err.debug.warn);
      }
    }
  }
}

export function debug(msg: any, options: Partial<ILogOptions> = {}) {
  options.level = LogLevel.debug;
  write(msg, options);
}

export function warn(msg: any, options: Partial<ILogOptions> = {}) {
  options.level = LogLevel.warn;
  write(msg, options);
}
export function info(msg: any, options: Partial<ILogOptions> = {}) {
  options.level = LogLevel.info;
  write(msg, options);
}
export function verbose(msg: any, options: Partial<ILogOptions> = {}) {
  options.level = LogLevel.verbose;
  write(msg, options);
}
//endregion console loggers
export default {
  d: debug,
  debug,
  e: error,
  error,
  i: info,
  info,
  init,
  log: debug,
  setDefault,
  setLogLevel,
  v: verbose,
  verbose,
  w: warn,
  warn,
};

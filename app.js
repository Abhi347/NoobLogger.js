const colors = require('colors');

const LOG_LEVEL_VALUES = {
  prod: -1,
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  verbose: 4
};

const DEFAULT_OPTIONS = {
  logLevel: 'debug', //verbose,debug, info, error, prod
  error: {
    level: 'error',
    force: false,
    showStack: false,
    showDebug: true
  },
  colorTheme: {
    verbose: 'cyan',
    info: 'green',
    warn: 'yellow',
    debug: 'white',
    error: 'red'
  }
};

let loggingOptions;
setDefault();

function init(options) {
  if (options.logLevel) {
    if (Object.keys(LOG_LEVEL_VALUES).indexOf(options.logLevel) !== -1) {
      loggingOptions.logLevel = options.logLevel;
    }
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
    for (prop in loggingOptions.colorTheme) {
      let newColor = options.colorTheme[prop];
      if (newColor) {
        loggingOptions.colorTheme[prop] = newColor;
      }
    }
    colors.setTheme(loggingOptions.colorTheme);
  }
}

function setDefault() {
  loggingOptions = DEFAULT_OPTIONS;
  colors.setTheme(loggingOptions.colorTheme);
}

function setLogLevel(logLevel) {
  loggingOptions.logLevel = logLevel;
}

//region console loggers
function checkLevel(level) {
  return LOG_LEVEL_VALUES[level] <= LOG_LEVEL_VALUES[loggingOptions.logLevel];
}
function write(msg, options) {
  const defaultOptions = {
    level: 'verbose',
    stringify: false,
    force: false
  };
  options = { ...defaultOptions, ...loggingOptions, ...options };
  if (options.force || checkLevel(options.level)) {
    if (options.stringify) {
      msg = JSON.stringify(msg);
    }
    if (typeof msg === 'string') {
      msg = msg[options.level];
    }
    console.log(msg);
  }
}
function error(err, options = {}) {
  options = { ...DEFAULT_OPTIONS.error, ...options };
  if (options.force || checkLevel(options.level)) {
    if (err.constructor.name === 'String') {
      console.error(err.red);
    } else {
      console.error(err);
      if (err.stack && options.showStack) {
        console.log(err.stack.red);
      }
      if (err.debug && options.showDebug) {
        console.log(err.debug.warn);
      }
    }
  }
}

function debug(msg, options = {}) {
  options.level = 'debug';
  write(msg, options);
}

function warn(msg, options = {}) {
  options.level = 'warn';
  write(msg, options);
}
function info(msg, options = {}) {
  options.level = 'info';
  write(msg, options);
}
function verbose(msg, options = {}) {
  options.level = 'verbose';
  write(msg, options);
}
//endregion console loggers
module.exports = {
  init: init,
  setDefault: setDefault,
  log: debug, //debug
  debug: debug, //debug
  error: error, //error
  warn: warn, //warn
  info: info, //info
  verbose: verbose, //verbose
  d: debug, //debug
  e: error, //error
  w: warn, //warn
  i: info, //info
  v: verbose //verbose
};

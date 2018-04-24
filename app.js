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
    if (LOG_LEVEL_VALUES.keys().indexOf(options.logLevel) !== -1) {
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
function write(msg, level, stringify = false) {
  if (checkLevel(level)) {
    if (stringify) {
      msg = JSON.stringify(msg);
    }
    if (typeof msg === 'string') {
      msg = msg[level];
    }
    console.log(msg);
  }
}
function error(err) {
  if (checkLevel('error')) {
    if (err.constructor.name === 'String') {
      console.error(err.red);
    } else {
      console.error(err);
    }
    if (err.stack && loggingOptions.showStack) {
      console.log(err.stack.red);
    }
    if (err.debug && loggingOptions.showDebug) {
      console.log(err.debug.warn);
    }
  }
}

function log(msg, stringify = false) {
  write(msg, 'debug', stringify);
}

function debug(msg, stringify = false) {
  log(msg, stringify);
}

function warn(msg, stringify = false) {
  write(msg, 'warn', stringify);
}
function info(msg, stringify = false) {
  write(msg, 'info', stringify);
}
function verbose(msg, stringify = false) {
  write(msg, 'verbose', stringify);
}
//endregion console loggers
module.exports = {
  init: init,
  setDefault: setDefault,
  log: log, //debug
  debug: debug, //debug
  error: error, //error
  warn: warn, //warn
  info: info, //info
  verbose: verbose //verbose
};

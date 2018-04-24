# @LogKat/Logger.js - Simple JS Logger

@LogKat/Logger.js is a simple logging library which provides power to your normal `console.log`.
It's easy to start and ever easier to customise.

## Features

* Controlled logging to console
* Control Log Levels
* Easy customisation
* Log only when a specified log level filter is satisfied
* Can programmatically disable the logs

## Planned feature

* More Customization support
* Saving log file

## Setup

@logkat/logger.js is hosted at npm. The instructions are as follows -

    npm install @logkat/logger

## Usage

Following methods are available as per the log levels

    const logkat = require('@logkat/logger');
    logkat.verbose(message);
    logkat.log(message); //or logkat.debug(message);
    logkat.info(message);
    logkat.warn(message);
    logkat.error(message);

You can set Log Filtering by choosing the required Log Level -

    logkat.setLogLevel('info');

Or you can choose to disable all logging

    logkat.setLogLevel('prod');

## Advanced Usage

If you're not happy with the default settings, you can change the settings, by calling `init(options)`

    logkat.init(options);

The default options are defined as

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

You can provide partial options in init. For example to change the color theme for warnings to red, you just have to do -

    logkat.init({
        colorTheme:{
            warn: 'red'
        }
    });

## Contributions

Feel free to report bugs, feedback or even suggest new features. I'd love to make it a great library.

## Donate

[Paypal](https://paypal.me/Abhi347/5)

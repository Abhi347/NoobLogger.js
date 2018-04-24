let logger = require('../app');
logger.init({
  colorTheme: {
    warn: 'blue'
  }
});
logger.verbose('verbose');
logger.log('debug');
logger.info('info');
logger.warn('warn');
logger.error('error');
logger.error(new Error('This is a custom error'));

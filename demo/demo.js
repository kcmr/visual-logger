const { log, warn, info, error, clear, logger } = window;

log.addEventListener('click', () => {
  console.log('My test are green!');
});

warn.addEventListener('click', () => {
  console.warn('Submarine is', 'yellow');
});

info.addEventListener('click', () => {
  console.info('Skies are', 'blue');
});

error.addEventListener('click', () => {
  console.error('Roses are', 'red');
});

clear.addEventListener('click', () => {
  logger.clear();
});

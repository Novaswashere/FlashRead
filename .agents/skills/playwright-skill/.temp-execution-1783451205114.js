
(async () => {
  try {
    const { chromium } = require('playwright'); console.log('Playwright is working!');
  } catch (error) {
    console.error('❌ Automation error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
})();

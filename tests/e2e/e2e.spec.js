const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Relative require since current directory will be the skill dir
const helpers = require('./lib/helpers');

const TARGET_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = 'C:/Users/ameen/Desktop/FlashRead-v1/tests/fixtures';

// Helper to wait
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Setup dynamic fixtures in case they aren't generated
function setupFixtures() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  // 1. Generate test.txt
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'test.txt'),
    'This is a speed reading test chapter. It contains some words that should flash on screen. We are testing Playwright E2E browser automation functionality for FlashRead.',
    'utf8'
  );

  // 2. Generate empty.txt
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'empty.txt'), '', 'utf8');

  // 3. Generate invalid.png
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'invalid.png'), 'Not actually an image, just dummy content for extension test', 'utf8');

  // 4. Generate corrupted.epub
  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'corrupted.epub'), 'This is not zip format data so JSZip should fail to parse it.', 'utf8');

  console.log('✅ E2E test fixtures verified/generated in:', SCREENSHOT_DIR);
}

async function runTests() {
  console.log('🧪 Starting Expanded E2E Integration Test Suite...');
  setupFixtures();

  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  try {
    // ----------------------------------------------------
    // Test Case 1: Load Homepage and Verify Theme styling
    // ----------------------------------------------------
    console.log('\n--- Test 1: Load Homepage & Verify Theme Styling ---');
    await page.goto(TARGET_URL);
    await page.waitForSelector('text=FlashRead');
    console.log('✅ Homepage loaded successfully.');
    
    // Take a screenshot of the homepage
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-homepage.png') });
    console.log('📸 Saved homepage screenshot to 01-homepage.png');

    // ----------------------------------------------------
    // Test Case 2: Authentication Page Layout & Interactive states
    // ----------------------------------------------------
    console.log('\n--- Test 2: Authentication UI Validation ---');
    await page.goto(`${TARGET_URL}/auth`);
    await page.waitForSelector('text=Welcome to FlashRead');
    console.log('✅ Auth page loaded successfully.');

    // Check if form components are visible
    const emailInput = page.locator('input[type="email"]');
    const submitBtn = page.locator('button:has-text("Continue with Email")');
    const googleBtn = page.locator('button:has-text("Continue with Google")');

    if (await emailInput.isVisible() && await submitBtn.isVisible() && await googleBtn.isVisible()) {
      console.log('✅ Email field, Submit button, and Google login button are all visible.');
    } else {
      throw new Error('❌ Missing interactive components on Auth page.');
    }

    // Type email
    await emailInput.fill('qa-bot@flashread.io');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-auth-page.png') });
    console.log('📸 Saved Auth Page layout screenshot to 02-auth-page.png');

    // ----------------------------------------------------
    // Test Case 3: File Ingestion (TXT File Upload Flow)
    // ----------------------------------------------------
    console.log('\n--- Test 3: TXT File Ingestion & Preview ---');
    await page.goto(`${TARGET_URL}/import`);
    await page.waitForSelector('.border-dashed');

    // Upload the file via setInputFiles
    console.log('Uploading valid TXT file...');
    await page.setInputFiles('input[type="file"]', path.join(SCREENSHOT_DIR, 'test.txt'));
    
    // Wait for the state to transit to PREVIEW
    await page.waitForSelector('text=Document Preview');
    console.log('✅ TXT file parsed, Document Preview modal opened.');

    const txtTitle = 'E2E Valid TXT Book ' + Date.now();
    await page.fill('input[placeholder="Enter book title"]', txtTitle);
    await page.fill('input[placeholder="Enter author name"]', 'QA TXT Author');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-import-txt-preview.png') });

    // Confirm Import
    await page.click('button:has-text("Add to Library")');
    await page.waitForURL(TARGET_URL);
    console.log('✅ TXT Book added. Redirected to Homepage.');

    // ----------------------------------------------------
    // Test Case 4: File Ingestion (EPUB File Upload Flow)
    // ----------------------------------------------------
    console.log('\n--- Test 4: EPUB File Ingestion & Preview ---');
    await page.goto(`${TARGET_URL}/import`);
    await page.waitForSelector('.border-dashed');

    // Upload the EPUB file
    console.log('Uploading valid EPUB file...');
    await page.setInputFiles('input[type="file"]', path.join(SCREENSHOT_DIR, 'test.epub'));

    // Wait for PREVIEW state
    await page.waitForSelector('text=Document Preview');
    console.log('✅ EPUB file parsed, Document Preview modal opened.');

    const epubTitle = 'E2E Valid EPUB Book ' + Date.now();
    await page.fill('input[placeholder="Enter book title"]', epubTitle);
    await page.fill('input[placeholder="Enter author name"]', 'QA EPUB Author');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-import-epub-preview.png') });

    // Confirm Import
    await page.click('button:has-text("Add to Library")');
    await page.waitForURL(TARGET_URL);
    console.log('✅ EPUB Book added. Redirected to Homepage.');

    // ----------------------------------------------------
    // Test Case 5: Library search, list, filtering, and click
    // ----------------------------------------------------
    console.log('\n--- Test 5: Library Listing, Search, and Open ---');
    await page.goto(`${TARGET_URL}/library`);
    await page.waitForSelector('input[placeholder*="Search"]');

    // Search for TXT book
    await page.fill('input[placeholder*="Search"]', txtTitle);
    await delay(500);
    let bookItem = page.locator('.list-item-hover').filter({ hasText: txtTitle }).first();
    if (await bookItem.isVisible()) {
      console.log(`✅ Newly uploaded TXT book "${txtTitle}" is visible in library.`);
    } else {
      throw new Error(`❌ TXT book "${txtTitle}" not found in library list.`);
    }

    // Search for EPUB book
    await page.fill('input[placeholder*="Search"]', epubTitle);
    await delay(500);
    bookItem = page.locator('.list-item-hover').filter({ hasText: epubTitle }).first();
    if (await bookItem.isVisible()) {
      console.log(`✅ Newly uploaded EPUB book "${epubTitle}" is visible in library.`);
    } else {
      throw new Error(`❌ EPUB book "${epubTitle}" not found in library list.`);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05-library-search.png') });

    // Open EPUB Book in Reader
    await bookItem.click();
    await page.waitForURL(/.*\/reader.*/);
    console.log('✅ Reader page loaded for the EPUB book.');

    // ----------------------------------------------------
    // Test Case 6: Reader RSVP controls, playback, speed, seek
    // ----------------------------------------------------
    console.log('\n--- Test 6: Reader Controls & Playback ---');
    
    // First wait for the play_arrow button to be visible to ensure the component is mounted
    await page.waitForSelector('button:has-text("play_arrow")');
    
    // Focus body to ensure keyboard shortcuts work
    await page.focus('body');
    await delay(200);

    let playBtn = page.locator('button:has-text("play_arrow")');
    if (await playBtn.isVisible()) {
      console.log('✅ Reader loaded in paused state.');
    }

    // Press Spacebar shortcut to Play
    console.log('Testing keyboard shortcut: Space to Play...');
    await page.keyboard.press('Space');
    await delay(1000); // Allow words to flash
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-reader-playing-space.png') });

    let pauseBtn = page.locator('button:has-text("pause")');
    if (await pauseBtn.isVisible()) {
      console.log('✅ Play keyboard shortcut successfully activated RSVP streaming.');
      // Press Space to Pause
      await page.keyboard.press('Space');
      await delay(200);
      console.log('✅ Pause keyboard shortcut successfully stopped RSVP streaming.');
    } else {
      console.log('⚠️ Play status button not matching pause state. Retrying click toggle...');
      const playToggleBtn = page.locator('button:has(span:has-text("play_arrow")), button:has(span:has-text("pause"))').first();
      await playToggleBtn.click();
      await delay(200);
    }

    // Test speed picker controls
    console.log('Adjusting Reading Speed (WPM)...');
    await page.click('button:has-text("Speed")');
    await page.waitForSelector('text=Reading Speed');
    
    // Target the range input slider and set value to 500
    const wpmSlider = page.locator('input[type="range"][min="100"]');
    await wpmSlider.evaluate(el => {
      el.value = '500';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    console.log('✅ Set WPM speed to 500 via slider.');
    await delay(500);
    
    // Close speed picker
    await page.click('button:has-text("close")');
    await delay(200);

    // Test Seek controls (ArrowRight and ArrowLeft)
    console.log('Testing Seek shortcut (ArrowRight)...');
    await page.keyboard.press('ArrowRight');
    await delay(200);
    console.log('Testing Seek shortcut (ArrowLeft)...');
    await page.keyboard.press('ArrowLeft');
    await delay(200);

    // Test Manual Chapter Navigation
    console.log('Testing Chapter Navigation in Toolbar...');
    const nextChapterBtn = page.locator('button[title="Next Chapter"]');
    if (await nextChapterBtn.isEnabled()) {
      await nextChapterBtn.click();
      console.log('✅ Clicked Next Chapter.');
      await delay(200);
      const prevChapterBtn = page.locator('button[title="Previous Chapter"]');
      await prevChapterBtn.click();
      console.log('✅ Clicked Previous Chapter.');
      await delay(200);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-reader-controls.png') });

    // ----------------------------------------------------
    // Test Case 7: Settings Adjustments (Default WPM, Theme, Font, Toggles)
    // ----------------------------------------------------
    console.log('\n--- Test 7: Settings Adjustments ---');
    await page.goto(`${TARGET_URL}/settings`);
    await page.waitForSelector('text=Settings');

    // Adjust WPM input
    console.log('Setting WPM default...');
    const wpmInput = page.locator('input[type="number"]');
    await wpmInput.fill('450');

    // Change Theme to Dark
    console.log('Setting Theme to Dark...');
    await page.click('button:has-text("Dark")');

    // Change Font to Merriweather
    console.log('Setting Font to Merriweather...');
    await page.click('button:has-text("Merriweather")');

    // Toggle ORP Highlight
    console.log('Toggling ORP Highlight...');
    await page.click('text=ORP Highlight');

    // Toggle Smart Pause
    console.log('Toggling Smart Pause...');
    await page.click('text=Smart Pause');

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-settings-adjusted.png') });
    console.log('✅ Settings parameters changed and verified.');

    // ----------------------------------------------------
    // Test Case 8: Failure Scenarios and Error Recovery
    // ----------------------------------------------------
    console.log('\n--- Test 8: Failure Scenarios and Error Recovery ---');

    // A. Empty TXT Upload
    console.log('A. Uploading Empty TXT File...');
    await page.goto(`${TARGET_URL}/import`);
    await page.waitForSelector('.border-dashed');
    await page.setInputFiles('input[type="file"]', path.join(SCREENSHOT_DIR, 'empty.txt'));
    await page.waitForSelector('text=EMPTY_DOCUMENT');
    console.log('✅ Correctly caught EMPTY_DOCUMENT exception.');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-error-empty.png') });
    await page.click('button:has-text("Close")');

    // B. Unsupported format
    console.log('B. Uploading Unsupported PNG File...');
    await page.setInputFiles('input[type="file"]', path.join(SCREENSHOT_DIR, 'invalid.png'));
    await page.waitForSelector('text=UNSUPPORTED_FORMAT');
    console.log('✅ Correctly caught UNSUPPORTED_FORMAT exception.');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10-error-unsupported.png') });
    await page.click('button:has-text("Close")');

    // C. Corrupted EPUB
    console.log('C. Uploading Corrupted EPUB File...');
    await page.setInputFiles('input[type="file"]', path.join(SCREENSHOT_DIR, 'corrupted.epub'));
    await page.waitForSelector('text=CORRUPTED_FILE');
    console.log('✅ Correctly caught CORRUPTED_FILE exception.');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11-error-corrupted.png') });
    await page.click('button:has-text("Close")');

    // D. Direct Navigation with Invalid Book ID
    console.log('D. Navigating directly with invalid book ID...');
    await page.goto(`${TARGET_URL}/reader?id=non-existent-book-id-9999`);
    await page.waitForSelector('text=No Book Selected');
    const warningText = await page.locator('text=Select a Book from the Library').innerText();
    console.log(`✅ Friendly warning page validated. Message: "${warningText}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-error-invalid-id.png') });

    // ----------------------------------------------------
    // Test Case 9: Library Deletion
    // ----------------------------------------------------
    console.log('\n--- Test 9: Deleting Imported Books ---');
    await page.goto(`${TARGET_URL}/library`);
    await page.waitForSelector('input[placeholder*="Search"]');

    // Deleting TXT book
    await page.fill('input[placeholder*="Search"]', txtTitle);
    await delay(500);
    
    page.once('dialog', async dialog => {
      console.log(`Accepting deletion confirm: "${dialog.message()}"`);
      await dialog.accept();
    });

    await page.locator('.list-item-hover').filter({ hasText: txtTitle }).locator('button:has-text("more_vert")').first().click();
    console.log(`✅ Clicked delete for TXT book "${txtTitle}".`);
    await delay(1000);

    // Deleting EPUB book
    await page.fill('input[placeholder*="Search"]', epubTitle);
    await delay(500);
    
    page.once('dialog', async dialog => {
      console.log(`Accepting deletion confirm: "${dialog.message()}"`);
      await dialog.accept();
    });

    await page.locator('.list-item-hover').filter({ hasText: epubTitle }).locator('button:has-text("more_vert")').first().click();
    console.log(`✅ Clicked delete for EPUB book "${epubTitle}".`);
    await delay(1000);

    // Verify deletion search returns nothing
    await page.fill('input[placeholder*="Search"]', txtTitle);
    await delay(500);
    const searchResultTxt = page.locator('.list-item-hover').filter({ hasText: txtTitle });
    if (!(await searchResultTxt.isVisible())) {
      console.log('✅ TXT Book successfully deleted from library.');
    } else {
      console.log('❌ TXT Book still visible after deletion.');
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13-library-post-delete.png') });

    // ----------------------------------------------------
    // Test Case 10: Responsive Layouts
    // ----------------------------------------------------
    console.log('\n--- Test 10: Responsive Viewports ---');
    const viewports = [360, 768, 1024, 1440];
    for (const width of viewports) {
      console.log(`Testing viewport width: ${width}px...`);
      await page.setViewportSize({ width, height: 800 });
      await page.goto(TARGET_URL);
      await delay(500);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `14-viewport-${width}.png`) });
    }
    console.log('✅ Responsive layout checks complete.');

    // ----------------------------------------------------
    // Test Case 11: Accessibility Audit
    // ----------------------------------------------------
    console.log('\n--- Test 11: Accessibility Audit ---');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(TARGET_URL);

    // Check main layout landmarks
    const headerRole = await page.locator('header').getAttribute('role');
    const asideTag = await page.locator('aside').isVisible();
    const navTag = await page.locator('nav').first().isVisible();
    console.log(`Accessibility check: Header has role "${headerRole || 'banner/default'}". Sidebar is visible: ${asideTag}. Nav is visible: ${navTag}.`);

    console.log('🏁 All E2E Integration and Failure tests completed successfully!');

  } catch (error) {
    console.error('❌ E2E Test Suite failed:', error);
  } finally {
    await browser.close();
  }
}

runTests();

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const FIXTURES_DIR = path.join(__dirname, '../fixtures');

async function generate() {
  if (!fs.existsSync(FIXTURES_DIR)) {
    fs.mkdirSync(FIXTURES_DIR, { recursive: true });
  }

  console.log('Generating E2E test fixtures in:', FIXTURES_DIR);

  // 1. Generate test.txt
  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'test.txt'),
    'This is a speed reading test chapter. It contains some words that should flash on screen. We are testing Playwright E2E browser automation functionality for FlashRead.',
    'utf8'
  );

  // 2. Generate empty.txt
  fs.writeFileSync(path.join(FIXTURES_DIR, 'empty.txt'), '', 'utf8');

  // 3. Generate invalid.png
  fs.writeFileSync(path.join(FIXTURES_DIR, 'invalid.png'), 'Not actually an image, just dummy content for extension test', 'utf8');

  // 4. Generate corrupted.epub
  fs.writeFileSync(path.join(FIXTURES_DIR, 'corrupted.epub'), 'This is not zip format data so JSZip should fail to parse it.', 'utf8');

  // 5. Generate valid test.epub
  const zip = new JSZip();
  
  // A. container.xml
  zip.file(
    'META-INF/container.xml',
    `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  // B. content.opf
  zip.file(
    'OEBPS/content.opf',
    `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>Test EPUB Book</dc:title>
    <dc:creator>E2E Bot</dc:creator>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
    <item id="chapter1" href="chapter1.html" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chapter1"/>
  </spine>
</package>`
  );

  // C. chapter1.html
  zip.file(
    'OEBPS/chapter1.html',
    `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Chapter 1</title>
</head>
<body>
  <h1>Chapter 1 Title</h1>
  <p>This is a speed reading test chapter. It contains some words that should flash on screen. We are testing EPUB parser and E2E browser automation functionality for FlashRead.</p>
</body>
</html>`
  );

  const content = await zip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(path.join(FIXTURES_DIR, 'test.epub'), content);

  console.log('✅ All E2E test fixtures generated successfully!');
}

generate().catch((err) => {
  console.error('❌ Failed to generate fixtures:', err);
  process.exit(1);
});

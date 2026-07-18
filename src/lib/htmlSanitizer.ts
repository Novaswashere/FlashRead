/**
 * HTML sanitization utilities for safely rendering user content.
 */

/**
 * Escapes HTML special characters in text to prevent XSS attacks.
 * This is used before adding any custom HTML markup.
 */
export function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEscapes[char]);
}

/**
 * Safely highlights a word within text by escaping HTML first,
 * then wrapping the target word in a mark element.
 */
export function highlightWordInTextSafely(
  text: string,
  wordIndexInParagraph: number,
  highlightClass: string = 'reading-anchor-highlight'
): string {
  // First, escape all HTML to prevent XSS
  const escapedText = escapeHtml(text);
  const words = escapedText.split(/\s+/).filter(Boolean);

  if (wordIndexInParagraph < 0 || wordIndexInParagraph >= words.length) {
    return escapedText;
  }

  const targetWord = words[wordIndexInParagraph];

  // Escape the word for regex (handles special regex characters)
  const escapedWord = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regex that matches the word at the correct position
  let wordCount = 0;
  const pattern = new RegExp(`\\b(${escapedWord})\\b`, 'gi');

  return escapedText.replace(pattern, (match) => {
    if (wordCount === wordIndexInParagraph) {
      wordCount++;
      return `<mark class="${highlightClass}">${match}</mark>`;
    }
    wordCount++;
    return match;
  });
}

/**
 * Creates a safe HTML string from plain text with line breaks preserved.
 */
export function textToHtml(text: string): string {
  return escapeHtml(text).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
}

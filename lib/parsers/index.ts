/**
 * File parsers for different document formats
 * Converts EPUB, PDF, and TXT files into a word stream for RSVP reading
 */

import { BookFormat, ParsedBook, BookMetadata } from '@/types/book';
import { parseEPUB } from './epub-parser';
import { parsePDF } from './pdf-parser';
import { parseTXT } from './txt-parser';

/**
 * Main parser dispatcher
 * Detects format and routes to appropriate parser
 */
export async function parseBook(
  fileUri: string,
  fileName: string,
  metadata: Partial<BookMetadata>
): Promise<ParsedBook> {
  const format = detectFormat(fileName);

  if (!format) {
    throw new Error(`Unsupported file format: ${fileName}`);
  }

  try {
    switch (format) {
      case 'EPUB':
        return await parseEPUB(fileUri, fileName, metadata);
      case 'PDF':
        return await parsePDF(fileUri, fileName, metadata);
      case 'TXT':
        return await parseTXT(fileUri, fileName, metadata);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    throw new Error(`Failed to parse ${format} file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Detects file format from file extension
 */
export function detectFormat(fileName: string): BookFormat | null {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'epub':
      return 'EPUB';
    case 'pdf':
      return 'PDF';
    case 'txt':
      return 'TXT';
    default:
      return null;
  }
}

/**
 * Converts text to word array, handling punctuation and special cases
 */
export function textToWords(text: string): string[] {
  // Remove extra whitespace and normalize
  const normalized = text
    .replace(/\s+/g, ' ')
    .trim();

  // Split by whitespace while preserving punctuation
  const words = normalized.split(/\s+/).filter(word => word.length > 0);

  return words;
}

/**
 * Extracts text content from HTML/XML
 * Removes tags and extra whitespace
 */
export function extractTextFromHTML(html: string): string {
  // Remove script and style tags
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up whitespace
  text = text
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

export { parseEPUB, parsePDF, parseTXT };

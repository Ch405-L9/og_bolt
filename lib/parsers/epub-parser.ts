/**
 * EPUB file parser
 * Extracts text from EPUB files and converts to word stream
 */

import * as FileSystem from 'expo-file-system/legacy';
import { BookMetadata, ParsedBook } from '@/types/book';
import { textToWords, extractTextFromHTML } from './index';

/**
 * Parse EPUB file
 * EPUB files are ZIP archives containing XHTML files
 * For simplicity, we'll use a basic approach that reads the file as text
 */
export async function parseEPUB(
  fileUri: string,
  fileName: string,
  metadata: Partial<BookMetadata>
): Promise<ParsedBook> {
  try {
    // Read the EPUB file
    // Note: Full EPUB parsing requires ZIP extraction and XML parsing
    // For MVP, we'll read it as a text file and extract content
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Extract text content (simplified approach)
    // In production, you would use a proper EPUB library
    const text = extractTextFromEPUB(fileContent);
    const words = textToWords(text);

    // Get file info for metadata
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    const parsedBook: ParsedBook = {
      metadata: {
        id: `epub-${Date.now()}`,
        title: metadata.title || fileName.replace('.epub', ''),
        author: metadata.author,
        format: 'EPUB',
        fileUri,
        fileSize: (fileInfo as any).size || 0,
        dateAdded: Date.now(),
        dateModified: Date.now(),
      },
      words,
    };

    return parsedBook;
  } catch (error) {
    throw new Error(`Failed to parse EPUB file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract text from EPUB content
 * Simplified extraction that handles basic XHTML content
 */
function extractTextFromEPUB(content: string): string {
  // Remove XML declaration and namespaces
  let text = content.replace(/<\?xml[^?]*\?>/g, '');

  // Extract text from XHTML body
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    text = bodyMatch[1];
  }

  // Remove common EPUB metadata and structure tags
  text = text
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<toc[^>]*>[\s\S]*?<\/toc>/gi, '')
    .replace(/<ncx[^>]*>[\s\S]*?<\/ncx>/gi, '');

  // Extract text from HTML
  text = extractTextFromHTML(text);

  return text;
}

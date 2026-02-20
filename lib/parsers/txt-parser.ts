/**
 * TXT file parser
 * Reads plain text files and converts to word stream
 */

import * as FileSystem from 'expo-file-system/legacy';
import { BookMetadata, ParsedBook } from '@/types/book';
import { textToWords } from './index';

/**
 * Parse TXT file
 * Simple text file reading and word extraction
 */
export async function parseTXT(
  fileUri: string,
  fileName: string,
  metadata: Partial<BookMetadata>
): Promise<ParsedBook> {
  try {
    // Read the text file
    const content = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Convert to words
    const words = textToWords(content);

    // Get file info for metadata
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    const parsedBook: ParsedBook = {
      metadata: {
        id: `txt-${Date.now()}`,
        title: metadata.title || fileName.replace('.txt', ''),
        author: metadata.author,
        format: 'TXT',
        fileUri,
        fileSize: (fileInfo as any).size || 0,
        dateAdded: Date.now(),
        dateModified: Date.now(),
      },
      words,
    };

    return parsedBook;
  } catch (error) {
    throw new Error(`Failed to parse TXT file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

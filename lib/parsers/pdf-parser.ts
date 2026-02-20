/**
 * PDF file parser
 * Extracts text from PDF files and converts to word stream
 */

import * as FileSystem from 'expo-file-system/legacy';
import { BookMetadata, ParsedBook } from '@/types/book';
import { textToWords } from './index';

/**
 * Parse PDF file
 * Uses pdfjs-dist for text extraction
 */
export async function parsePDF(
  fileUri: string,
  fileName: string,
  metadata: Partial<BookMetadata>
): Promise<ParsedBook> {
  try {
    // For web/React Native, PDF parsing is complex
    // We'll use a simplified approach that reads the file
    // In production, you would integrate with a native PDF library
    // or use a backend service for PDF parsing

    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Extract text from PDF (simplified)
    // This is a basic extraction that handles simple PDFs
    const text = extractTextFromPDF(fileContent);
    const words = textToWords(text);

    // Get file info for metadata
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    const parsedBook: ParsedBook = {
      metadata: {
        id: `pdf-${Date.now()}`,
        title: metadata.title || fileName.replace('.pdf', ''),
        author: metadata.author,
        format: 'PDF',
        fileUri,
        fileSize: (fileInfo as any).size || 0,
        dateAdded: Date.now(),
        dateModified: Date.now(),
      },
      words,
    };

    return parsedBook;
  } catch (error) {
    throw new Error(`Failed to parse PDF file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Extract text from PDF content
 * This is a simplified extraction that works with basic PDFs
 * For production, consider using a native module or backend service
 */
function extractTextFromPDF(content: string): string {
  // Remove PDF binary markers and metadata
  let text = content
    .replace(/%PDF-[\d.]+/g, '')
    .replace(/%%EOF/g, '')
    .replace(/stream[\s\S]*?endstream/g, '');

  // Extract text between BT (begin text) and ET (end text) operators
  const textMatches = content.match(/BT[\s\S]*?ET/g) || [];
  if (textMatches.length > 0) {
    text = textMatches
      .map(match => {
        // Extract text strings (simplified)
        const strings = match.match(/\((.*?)\)/g) || [];
        return strings
          .map(s => s.slice(1, -1))
          .join(' ');
      })
      .join(' ');
  }

  // Clean up
  text = text
    .replace(/[^\w\s\.\,\!\?\'\"\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

/**
 * Smart chunking utilities for RAG system
 */

import crypto from "crypto";

export interface Chunk {
  content: string;
  metadata: {
    startIndex: number;
    endIndex: number;
    hasCode: boolean;
    codeLanguage?: string;
  };
}

export interface ChunkOptions {
  maxTokens?: number; // Target chunk size (default: 800)
  overlap?: number; // Overlap in tokens (default: 100)
  preserveCode?: boolean; // Keep code blocks intact (default: true)
}

/**
 * Rough token estimation (1 token ≈ 4 characters for English text)
 */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Generate content hash for deduplication
 */
export function generateContentHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

/**
 * Extract code blocks from markdown content
 */
function extractCodeBlocks(content: string): {
  start: number;
  end: number;
  language: string;
  content: string;
}[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: {
    start: number;
    end: number;
    language: string;
    content: string;
  }[] = [];

  let match;
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      start: match.index,
      end: match.index + match[0].length,
      language: match[1] || "text",
      content: match[0],
    });
  }

  return blocks;
}

/**
 * Split content into chunks while preserving code blocks
 */
export function chunkContent(
  content: string,
  options: ChunkOptions = {}
): Chunk[] {
  const { maxTokens = 800, overlap = 100, preserveCode = true } = options;

  const chunks: Chunk[] = [];

  if (preserveCode) {
    const codeBlocks = extractCodeBlocks(content);

    // If no code blocks, do simple chunking
    if (codeBlocks.length === 0) {
      return simpleChunk(content, maxTokens, overlap);
    }

    let lastIndex = 0;

    for (const codeBlock of codeBlocks) {
      // Chunk text before code block
      if (codeBlock.start > lastIndex) {
        const textBefore = content.slice(lastIndex, codeBlock.start);
        const textChunks = simpleChunk(textBefore, maxTokens, overlap);
        chunks.push(...textChunks);
      }

      // Find context around code block (previous paragraph + code + next paragraph)
      const contextStart = Math.max(
        0,
        content.lastIndexOf("\n\n", codeBlock.start - 1)
      );
      const contextEnd = content.indexOf("\n\n", codeBlock.end);
      const contextEndFinal =
        contextEnd === -1 ? content.length : contextEnd + 2;

      const chunkContent = content.slice(contextStart, contextEndFinal).trim();

      chunks.push({
        content: chunkContent,
        metadata: {
          startIndex: contextStart,
          endIndex: contextEndFinal,
          hasCode: true,
          codeLanguage: codeBlock.language,
        },
      });

      lastIndex = contextEndFinal;
    }

    // Chunk remaining text
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      const remainingChunks = simpleChunk(remainingText, maxTokens, overlap);
      chunks.push(...remainingChunks);
    }
  } else {
    return simpleChunk(content, maxTokens, overlap);
  }

  return chunks;
}

/**
 * Simple text chunking without code block preservation
 */
function simpleChunk(
  content: string,
  maxTokens: number,
  overlap: number
): Chunk[] {
  const chunks: Chunk[] = [];

  // Split by paragraphs first
  const paragraphs = content.split(/\n\n+/);
  let currentChunk = "";
  let startIndex = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const testChunk = currentChunk + (currentChunk ? "\n\n" : "") + paragraph;

    if (estimateTokens(testChunk) <= maxTokens) {
      currentChunk = testChunk;
    } else {
      // Save current chunk if not empty
      if (currentChunk) {
        const chunkStartIndex = content.indexOf(currentChunk, startIndex);
        chunks.push({
          content: currentChunk,
          metadata: {
            startIndex: chunkStartIndex,
            endIndex: chunkStartIndex + currentChunk.length,
            hasCode: false,
          },
        });

        // Start new chunk with overlap
        const words = currentChunk.split(/\s+/);
        const overlapWords = words.slice(-Math.floor(overlap / 4)); // Rough overlap
        currentChunk = overlapWords.join(" ") + "\n\n" + paragraph;
        startIndex = chunkStartIndex + currentChunk.length - overlap;
      } else {
        // Paragraph is too long, force split by sentences
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
        let sentenceBuffer = "";

        for (const sentence of sentences) {
          const testChunk = sentenceBuffer + sentence;
          if (estimateTokens(testChunk) > maxTokens && sentenceBuffer) {
            // Current sentence buffer exceeds limit, push it
            const chunkStartIndex = content.indexOf(sentenceBuffer, startIndex);
            chunks.push({
              content: sentenceBuffer.trim(),
              metadata: {
                startIndex: chunkStartIndex,
                endIndex: chunkStartIndex + sentenceBuffer.length,
                hasCode: false,
              },
            });
            startIndex = chunkStartIndex + sentenceBuffer.length;
            sentenceBuffer = sentence; // Start new buffer with current sentence
          } else {
            sentenceBuffer += sentence;
          }
        }

        // Add remaining sentences to currentChunk
        currentChunk = sentenceBuffer;
      }
    }
  }

  // Add final chunk
  if (currentChunk) {
    const chunkStartIndex = content.indexOf(currentChunk, startIndex);
    chunks.push({
      content: currentChunk,
      metadata: {
        startIndex: chunkStartIndex,
        endIndex: chunkStartIndex + currentChunk.length,
        hasCode: false,
      },
    });
  }

  return chunks;
}

/**
 * Chunk content specifically for workshop pages
 * Adds special handling for sections and metadata
 */
export function chunkWorkshopPage(
  content: string,
  pageMetadata: {
    title: string;
    url: string;
    sections?: string[];
  },
  options: ChunkOptions = {}
): Array<
  Chunk & {
    pageTitle: string;
    pageUrl: string;
    section?: string;
  }
> {
  const baseChunks = chunkContent(content, options);

  // Try to extract section information
  const sectionRegex = /^#{1,3}\s+(.+)$/gm;
  const sections: { title: string; index: number }[] = [];

  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    sections.push({
      title: match[1],
      index: match.index,
    });
  }

  // Assign sections to chunks
  return baseChunks.map((chunk) => {
    // Find which section this chunk belongs to
    const section = sections
      .slice()
      .reverse()
      .find((s) => s.index <= chunk.metadata.startIndex);

    return {
      ...chunk,
      pageTitle: pageMetadata.title,
      pageUrl: pageMetadata.url,
      section: section?.title,
    };
  });
}

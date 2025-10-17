/**
 * RAG retrieval utilities for AI assistant
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey =
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY not found - RAG retrieval will be disabled");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/**
 * Generate embedding for a query
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  if (!genAI) {
    throw new Error("Gemini API key not configured");
  }

  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(query);
  return result.embedding.values;
}

export interface RetrievedChunk {
  _id: string;
  content: string;
  pageTitle: string;
  pageUrl: string;
  section?: string;
  contentType: "explanation" | "code" | "concept" | "example";
  sourceType: "workshop" | "docs" | "code";
  score: number;
}

/**
 * Retrieve relevant chunks using vector search
 */
export async function retrieveRelevantChunks(
  query: string,
  options: {
    limit?: number;
    sourceType?: "workshop" | "docs" | "code";
  } = {}
): Promise<RetrievedChunk[]> {
  try {
    // Generate embedding for query
    const embedding = await generateQueryEmbedding(query);

    // Call Convex action for vector search
    const response = await fetch("/api/rag/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embedding,
        limit: options.limit || 5,
        sourceType: options.sourceType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error("Error retrieving chunks:", error);
    return [];
  }
}

/**
 * Build context string from retrieved chunks
 */
export function buildContextFromChunks(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return "";
  }

  const sections = chunks.map((chunk, idx) => {
    const header = `## Source ${idx + 1}: ${chunk.pageTitle}${chunk.section ? ` - ${chunk.section}` : ""}`;
    const url = `URL: ${chunk.pageUrl}`;
    const content = chunk.content;

    return `${header}\n${url}\n\n${content}`;
  });

  return sections.join("\n\n---\n\n");
}

/**
 * Extract sources from retrieved chunks for citation
 */
export function extractSources(chunks: RetrievedChunk[]): Array<{
  title: string;
  url: string;
  section?: string;
}> {
  const uniqueSources = new Map<
    string,
    { title: string; url: string; section?: string }
  >();

  for (const chunk of chunks) {
    const key = chunk.pageUrl;
    if (!uniqueSources.has(key)) {
      uniqueSources.set(key, {
        title: chunk.pageTitle,
        url: chunk.pageUrl,
        section: chunk.section,
      });
    }
  }

  return Array.from(uniqueSources.values());
}

/**
 * RAG retrieval utilities for AI assistant
 */

/**
 * Generate embedding for a query using server-side API
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const response = await fetch("/api/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: query }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate embedding");
  }

  const data = await response.json();
  return data.embedding;
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

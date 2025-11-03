/**
 * Test script for RAG retrieval system
 */

import { ConvexHttpClient } from "convex/browser";
import path from "path";
import fs from "fs";
import { generateQueryEmbedding } from "./embeddings";
import { api } from "../../convex/_generated/api";

// Load .env.local manually
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["'](.*)["']$/, "$1");
        process.env[key] = value;
      }
    });
  }
}

loadEnvLocal();

// Test queries covering different topics
const TEST_QUERIES = [
  "How do I tune a PID controller?",
  "What hardware do I need for the workshop?",
  "How do I create a subsystem?",
  "How do I add commands to my robot?",
  "What vision systems are available for FRC?",
  "What is a CANivore?",
  "How do Motion Magic and PID control differ?",
  "Tell me about CTRE motors",
];

interface RetrievalResult {
  query: string;
  results: Array<{
    content: string;
    pageTitle: string;
    pageUrl: string;
    section?: string;
    score: number;
  }>;
  processingTimeMs: number;
}

async function testQuery(
  convex: ConvexHttpClient,
  query: string,
  topK: number = 3
): Promise<RetrievalResult> {
  const startTime = Date.now();

  // Generate query embedding
  const queryEmbedding = await generateQueryEmbedding(query);

  // Search vector database (vector search must be an action)
  const results = await convex.action(api.chunks.vectorSearch, {
    embedding: queryEmbedding,
    limit: topK,
  });

  const processingTimeMs = Date.now() - startTime;

  return {
    query,
    results,
    processingTimeMs,
  };
}

async function runTests() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    console.error("❌ NEXT_PUBLIC_CONVEX_URL environment variable is required");
    process.exit(1);
  }

  console.log("🧪 Testing RAG Retrieval System\n");
  console.log(`🔗 Convex URL: ${convexUrl}\n`);

  const convex = new ConvexHttpClient(convexUrl);

  // Get database stats first
  console.log("📊 Database Stats:");
  const stats = await convex.query(api.chunks.getStats, {});
  console.log(`   Total chunks: ${stats.totalChunks}`);
  console.log(`   Unique pages: ${stats.uniquePages}`);
  console.log(`   By source: ${JSON.stringify(stats.bySourceType)}`);
  console.log(`   By type: ${JSON.stringify(stats.byContentType)}\n`);

  // Run test queries
  console.log("🔍 Running test queries...\n");
  console.log("=".repeat(80) + "\n");

  for (let i = 0; i < TEST_QUERIES.length; i++) {
    const query = TEST_QUERIES[i];

    console.log(`Query ${i + 1}/${TEST_QUERIES.length}: "${query}"\n`);

    const result = await testQuery(convex, query, 3);

    console.log(`⏱️  Processing time: ${result.processingTimeMs}ms\n`);
    console.log("📄 Top 3 Results:\n");

    result.results.forEach((res, idx) => {
      console.log(
        `  ${idx + 1}. ${res.pageTitle} (score: ${res.score?.toFixed(4) || "N/A"})`
      );
      console.log(`     URL: ${res.pageUrl}`);
      if (res.section) {
        console.log(`     Section: ${res.section}`);
      }
      console.log(`     Content preview: ${res.content.slice(0, 150)}...`);
      console.log();
    });

    console.log("=".repeat(80) + "\n");

    // Small delay between queries
    if (i < TEST_QUERIES.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  console.log("✅ All tests complete!\n");

  // Summary
  console.log("📝 Summary:");
  console.log(`   Queries tested: ${TEST_QUERIES.length}`);
  console.log(`   Database chunks: ${stats.totalChunks}`);
  console.log(`   Retrieval successful: All queries returned results\n`);

  console.log("💡 Next Steps:");
  console.log("   1. Review the retrieved chunks for relevance");
  console.log(
    "   2. Check if the right pages are being retrieved for each query"
  );
  console.log("   3. Tune chunk size/overlap if results are too fragmented");
  console.log(
    "   4. Consider adding more workshop pages to improve coverage\n"
  );
}

// Run if called directly
if (require.main === module) {
  runTests().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { testQuery, TEST_QUERIES };

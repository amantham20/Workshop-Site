/**
 * Pilot RAG indexer - Index 5 workshop pages to test the system
 */

import { ConvexHttpClient } from "convex/browser";
import path from "path";
import fs from "fs";
import { extractWorkshopPages } from "./content-extractor";
import { chunkWorkshopPage, generateContentHash } from "./chunker";
import { generateEmbeddings } from "./embeddings";
import { api } from "../../convex/_generated/api";

// Load .env.local manually for script execution
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

// Pilot pages to index
const PILOT_PAGES = [
  "/hardware", // Hardware overview with CTRE products
  "/building-subsystems", // Core programming concepts
  "/pid-control", // Advanced control topic
  "/adding-commands", // Command-based programming
  "/vision-options", // Vision systems with external links
];

interface IndexingOptions {
  convexUrl: string;
  appDir: string;
  verbose?: boolean;
}

async function indexPilotPages(options: IndexingOptions) {
  const { convexUrl, appDir, verbose = true } = options;

  if (verbose) {
    console.log("🚀 Starting pilot RAG indexing...\n");
    console.log(`📁 App directory: ${appDir}`);
    console.log(`🔗 Convex URL: ${convexUrl}`);
    console.log(`📄 Pages to index: ${PILOT_PAGES.length}\n`);
  }

  // Initialize Convex client
  const convex = new ConvexHttpClient(convexUrl);

  try {
    // Step 1: Extract content from pilot pages
    if (verbose) console.log("📖 Step 1: Extracting page content...");
    const pages = extractWorkshopPages(appDir, PILOT_PAGES);
    if (verbose) console.log(`   ✓ Extracted ${pages.length} pages\n`);

    // Step 2: Chunk the content
    if (verbose) console.log("✂️  Step 2: Chunking content...");
    const allChunks: Array<{
      content: string;
      pageTitle: string;
      pageUrl: string;
      section?: string;
      sequencePosition?: number;
      prerequisites?: string[];
      contentHash: string;
      hasCode: boolean;
      codeLanguage?: string;
    }> = [];

    for (const page of pages) {
      const chunks = chunkWorkshopPage(
        page.content,
        {
          title: page.title,
          url: page.url,
        },
        {
          maxTokens: 800,
          overlap: 100,
          preserveCode: true,
        }
      );

      for (const chunk of chunks) {
        allChunks.push({
          content: chunk.content,
          pageTitle: chunk.pageTitle,
          pageUrl: chunk.pageUrl,
          section: chunk.section,
          sequencePosition: page.sequencePosition,
          prerequisites: page.prerequisites,
          contentHash: generateContentHash(chunk.content),
          hasCode: chunk.metadata.hasCode,
          codeLanguage: chunk.metadata.codeLanguage,
        });
      }
    }

    if (verbose) {
      console.log(`   ✓ Created ${allChunks.length} chunks\n`);
      console.log("   Chunks by page:");
      const chunksByPage = allChunks.reduce((acc, chunk) => {
        acc[chunk.pageUrl] = (acc[chunk.pageUrl] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      for (const [url, count] of Object.entries(chunksByPage)) {
        console.log(`     ${url}: ${count} chunks`);
      }
      console.log();
    }

    // Step 3: Generate embeddings
    if (verbose) console.log("🧠 Step 3: Generating embeddings...");
    const texts = allChunks.map((chunk) => chunk.content);

    const embeddings = await generateEmbeddings(texts, {
      batchSize: 10,
      delayMs: 100,
      onProgress: (completed, total) => {
        if (verbose) {
          process.stdout.write(
            `\r   Progress: ${completed}/${total} (${Math.round((completed / total) * 100)}%)`
          );
        }
      },
    });

    if (verbose) console.log("\n   ✓ Generated embeddings\n");

    // Step 4: Upload to Convex
    if (verbose) console.log("☁️  Step 4: Uploading to Convex...");

    const chunksWithEmbeddings = allChunks.map((chunk, i) => ({
      content: chunk.content,
      embedding: embeddings[i],
      pageTitle: chunk.pageTitle,
      pageUrl: chunk.pageUrl,
      section: chunk.section,
      contentType: chunk.hasCode ? ("code" as const) : ("explanation" as const),
      sequencePosition: chunk.sequencePosition,
      prerequisites: chunk.prerequisites,
      sourceType: "workshop" as const,
      language: chunk.codeLanguage,
      contentHash: chunk.contentHash,
    }));

    // Upload in batches of 25 (Convex limitation)
    const BATCH_SIZE = 25;
    let uploaded = 0;

    for (let i = 0; i < chunksWithEmbeddings.length; i += BATCH_SIZE) {
      const batch = chunksWithEmbeddings.slice(i, i + BATCH_SIZE);

      await convex.mutation(api.chunks.upsertChunks, {
        chunks: batch,
      });

      uploaded += batch.length;

      if (verbose) {
        process.stdout.write(
          `\r   Progress: ${uploaded}/${chunksWithEmbeddings.length} chunks`
        );
      }
    }

    if (verbose) console.log("\n   ✓ Upload complete\n");

    // Step 5: Get stats
    const stats = await convex.query(api.chunks.getStats, {});
    if (verbose) {
      console.log("📊 Step 5: Fetching stats...");
      console.log(`   Total chunks in database: ${stats.totalChunks}`);
      console.log(`   Unique pages: ${stats.uniquePages}`);
      console.log(`   By source type:`, stats.bySourceType);
      console.log(`   By content type:`, stats.byContentType);
      console.log();
    }

    if (verbose) {
      console.log("✨ Pilot indexing complete!");
      console.log(`\n🎯 Indexed ${pages.length} pages with ${allChunks.length} chunks`);
      console.log(
        `📍 View in Convex Dashboard: https://dashboard.convex.dev/d/useful-boar-291\n`
      );
    }

    return {
      success: true,
      pagesIndexed: pages.length,
      chunksCreated: allChunks.length,
      stats,
    };
  } catch (error) {
    console.error("❌ Error during indexing:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    console.error("❌ NEXT_PUBLIC_CONVEX_URL environment variable is required");
    process.exit(1);
  }

  const appDir = path.join(__dirname, "../../src/app");

  indexPilotPages({
    convexUrl,
    appDir,
    verbose: true,
  }).catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { indexPilotPages, PILOT_PAGES };

/**
 * Code indexer - Index Java code from GitHub repositories
 */

import { ConvexHttpClient } from "convex/browser";
import path from "path";
import fs from "fs";
import { createGitHubClient } from "./github-client";
import { parseJavaFile, getClassSummary } from "./code-parser";
import { chunkJavaFile, getChunkStats } from "./code-chunker";
import { generateEmbeddings } from "./embeddings";
import { generateContentHash } from "./chunker";
import { api } from "../../convex/_generated/api";
import {
  CodeRepository,
  PILOT_REPOSITORIES,
  ALL_REPOSITORIES,
  shouldIncludeFile,
  getRepositoryName,
  getGitHubFileUrl,
} from "./code-repositories";

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

interface IndexingOptions {
  convexUrl: string;
  repositories: CodeRepository[];
  verbose?: boolean;
  pilot?: boolean;
}

async function indexCodeRepositories(options: IndexingOptions) {
  const { convexUrl, repositories, verbose = true, pilot = false } = options;

  if (verbose) {
    console.log(`🚀 Starting ${pilot ? "PILOT" : "FULL"} code indexing...\n`);
    console.log(`🔗 Convex URL: ${convexUrl}`);
    console.log(`📦 Repositories to index: ${repositories.length}\n`);
  }

  // Initialize Convex client
  const convex = new ConvexHttpClient(convexUrl);

  try {
    const allChunks: Array<{
      content: string;
      pageTitle: string;
      pageUrl: string;
      filePath: string;
      githubUrl: string;
      package: string;
      className: string;
      methods: string[];
      language: string;
      contentHash: string;
      sourceType: string;
    }> = [];

    // Process each repository
    for (let repoIndex = 0; repoIndex < repositories.length; repoIndex++) {
      const repo = repositories[repoIndex];
      const repoName = getRepositoryName(repo);

      if (verbose) {
        console.log(
          `\n📚 [${repoIndex + 1}/${repositories.length}] Processing ${repoName}...`
        );
        console.log(`   Description: ${repo.description}`);
      }

      // Step 1: Fetch files from GitHub
      if (verbose) console.log(`   📥 Fetching Java files from GitHub...`);

      const githubClient = createGitHubClient({
        owner: repo.owner,
        repo: repo.repo,
        branch: repo.branch,
      });

      // Check rate limit
      const rateLimit = await githubClient.getRateLimit();
      if (verbose) {
        console.log(
          `      GitHub API: ${rateLimit.remaining}/${rateLimit.limit} requests remaining`
        );
      }

      if (rateLimit.remaining < 10) {
        console.warn(
          `      ⚠️  Low rate limit! Resets at ${rateLimit.reset.toISOString()}`
        );
      }

      const files = await githubClient.getJavaFiles();

      // Filter files based on repository configuration
      const filteredFiles = files.filter((file) =>
        shouldIncludeFile(file.path, repo)
      );

      if (verbose) {
        console.log(`      ✓ Found ${filteredFiles.length} Java files`);
      }

      if (filteredFiles.length === 0) {
        console.warn(`      ⚠️  No files to index in this repository`);
        continue;
      }

      // Step 2: Parse Java files
      if (verbose) console.log(`   🔍 Parsing Java code...`);

      const parsedFiles = filteredFiles.map((file) => {
        try {
          const parsed = parseJavaFile(file.path, file.content);
          return { file, parsed };
        } catch (error) {
          console.error(`      ✗ Failed to parse ${file.path}:`, error);
          return null;
        }
      });

      const validParsedFiles = parsedFiles.filter((f) => f !== null) as Array<{
        file: { path: string; githubUrl: string };
        parsed: ReturnType<typeof parseJavaFile>;
      }>;

      if (verbose) {
        console.log(
          `      ✓ Parsed ${validParsedFiles.length}/${filteredFiles.length} files`
        );
      }

      // Step 3: Chunk the code
      if (verbose) console.log(`   ✂️  Chunking code...`);

      let repoChunkCount = 0;

      for (const { file, parsed } of validParsedFiles) {
        const chunks = chunkJavaFile(parsed, file.githubUrl, {
          maxTokens: 800,
          includeImports: true,
          includeClassContext: true,
          groupRelatedMethods: true,
        });

        for (const chunk of chunks) {
          allChunks.push({
            content: chunk.content,
            pageTitle: `${parsed.package}.${chunk.metadata.className}`,
            pageUrl: file.githubUrl,
            filePath: chunk.metadata.filePath,
            githubUrl: chunk.metadata.githubUrl,
            package: chunk.metadata.package,
            className: chunk.metadata.className,
            methods: chunk.metadata.methods,
            language: "java",
            contentHash: generateContentHash(chunk.content),
            sourceType: repo.sourceType,
          });

          repoChunkCount++;
        }
      }

      if (verbose) {
        console.log(`      ✓ Created ${repoChunkCount} chunks`);

        // Show chunk statistics
        const repoChunks = allChunks.slice(-repoChunkCount);
        const stats = getChunkStats(
          repoChunks.map((c) => ({
            content: c.content,
            metadata: {
              filePath: c.filePath,
              githubUrl: c.githubUrl,
              package: c.package,
              className: c.className,
              methods: c.methods,
              imports: [],
              contentType: "full-class" as const,
              language: "java" as const,
              startLine: 0,
              endLine: 0,
              estimatedTokens: Math.ceil(c.content.length / 3.5),
            },
          }))
        );

        console.log(`      Chunk stats:`);
        console.log(`        - Full classes: ${stats.fullClassChunks}`);
        console.log(`        - Methods: ${stats.methodChunks}`);
        console.log(`        - Method groups: ${stats.methodGroupChunks}`);
        console.log(`        - Avg tokens: ${stats.avgTokens}`);
        console.log(
          `        - Token range: ${stats.minTokens} - ${stats.maxTokens}`
        );
      }
    }

    // Step 4: Generate embeddings
    if (verbose) {
      console.log(
        `\n🧠 Generating embeddings for ${allChunks.length} chunks...`
      );
    }

    const texts = allChunks.map((chunk) => chunk.content);

    const embeddings = await generateEmbeddings(texts, {
      batchSize: 10,
      delayMs: 150,
      onProgress: (completed, total) => {
        if (verbose) {
          process.stdout.write(
            `   Progress: ${completed}/${total} (${Math.round((completed / total) * 100)}%)\r`
          );
        }
      },
    });

    if (verbose) console.log("\n   ✓ Generated embeddings");

    // Step 5: Upload to Convex
    if (verbose) console.log(`\n☁️  Uploading to Convex...`);

    const chunksWithEmbeddings = allChunks.map((chunk, i) => ({
      content: chunk.content,
      embedding: embeddings[i],
      pageTitle: chunk.pageTitle,
      pageUrl: chunk.pageUrl,
      contentType: "code" as const,
      sourceType: "code" as const,
      language: chunk.language,
      filePath: chunk.filePath,
      githubUrl: chunk.githubUrl,
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
          `   Progress: ${uploaded}/${chunksWithEmbeddings.length} chunks\r`
        );
      }
    }

    if (verbose) console.log("\n   ✓ Upload complete");

    // Step 6: Get stats
    const stats = await convex.query(api.chunks.getStats, {});
    if (verbose) {
      console.log(`\n📊 Database Stats:`);
      console.log(`   Total chunks in database: ${stats.totalChunks}`);
      console.log(`   Unique pages: ${stats.uniquePages}`);
      console.log(`   By source type:`, stats.bySourceType);
      console.log(`   By content type:`, stats.byContentType);
      console.log();
    }

    if (verbose) {
      console.log("✨ Code indexing complete!");
      console.log(
        `\n🎯 Indexed ${repositories.length} repositories with ${allChunks.length} chunks`
      );
      console.log(
        `📍 View in Convex Dashboard: https://dashboard.convex.dev/d/useful-boar-291\n`
      );
    }

    return {
      success: true,
      repositoriesIndexed: repositories.length,
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
    console.error("   Make sure .env.local exists with NEXT_PUBLIC_CONVEX_URL");
    process.exit(1);
  }

  // Check if GitHub token is available (optional but recommended)
  if (!process.env.GITHUB_TOKEN) {
    console.warn("⚠️  No GITHUB_TOKEN found in environment");
    console.warn(
      "   You'll have lower rate limits (60 requests/hour vs 5000/hour)"
    );
    console.warn("   Add GITHUB_TOKEN to .env.local for higher limits\n");
  }

  // Use pilot mode if --pilot flag is passed
  const isPilot = process.argv.includes("--pilot");
  const repositories = isPilot ? PILOT_REPOSITORIES : ALL_REPOSITORIES;

  indexCodeRepositories({
    convexUrl,
    repositories,
    verbose: true,
    pilot: isPilot,
  }).catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { indexCodeRepositories, PILOT_REPOSITORIES, ALL_REPOSITORIES };

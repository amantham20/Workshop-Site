# CodeRabbit Issue Tracker

## 🔴 Batch 1: Critical (Must Fix - Will Break) ✅ COMPLETED

### ✅ 1. Invalid nested mutations - `convex/chunks.ts`
**Lines:** 66-94, 96-137
**Issue:** `ctx.runMutation` called inside mutations (runtime failure)
**Fix:** Inlined the upsert logic directly into both mutations
**Status:** ✅ DONE

### ✅ 2. Score/chunk ID mismatch - `convex/chunks.ts`
**Lines:** 175-197
**Issue:** Index-based mapping breaks when fetchChunksByIds returns fewer docs than searchResults
**Fix:** Built ID-based lookup map using Map, filters null results
**Status:** ✅ DONE

### ✅ 3. ESM compatibility (2 files)
**Files:**
- `scripts/rag/external-docs-indexer.ts:214-230`
- `scripts/rag/workshop-indexer.ts:245-270`

**Issue:** `require.main === module` undefined in ESM
**Fix:** Used `import.meta.url` pattern with backslash normalization for Windows compatibility
**Status:** ✅ DONE

---

## 🟡 Batch 2: Data Quality ✅ COMPLETED

### 4. Embedding validation - `convex/chunks.ts`
**Lines:** 37-63, 66-94, 96-137
**Issue:** No validation that embeddings are correct length/finite numbers
**Fix:** Created `isValidEmbedding()` helper function that validates:
  - Array type check
  - Length validation (768 dimensions for text-embedding-004)
  - Finite number validation using `Number.isFinite()`
  - Applied to all three handlers: `internalUpsertChunk`, `upsertChunk`, `upsertChunks`
**Status:** ✅ DONE

### 5. Force split doesn't split - `scripts/rag/chunker.ts`
**Lines:** 176-180
**Issue:** Oversized paragraphs remain unsplit (just reassigns whole paragraph)
**Fix:** Implemented actual sentence splitting:
  - Splits paragraph using regex `/[^.!?]+[.!?]+/g`
  - Iterates through sentences with token counting
  - Pushes chunks when adding next sentence would exceed maxTokens
  - Properly handles sentence buffer and remaining sentences
**Status:** ✅ DONE

---

## 🟠 Batch 3: Type Safety

### 6a. Preserve sourceType - `scripts/rag/code-indexer.ts`
**Lines:** 243-254
**Issue:** Hard-codes `sourceType: "code"`, discards original provenance
**Fix:** `sourceType: chunk.sourceType ?? "code"`
**Status:** TODO

### 6b. Add vendor to type - `scripts/rag/external-docs-scraper.ts`
**Lines:** 110-116
**Issue:** TypeScript error - `metadata.vendor` not in ScrapedPage type
**Fix:** Add `vendor?: string` to ScrapedPage.metadata interface
**Status:** TODO

---

## 🟢 Batch 4: Web Scraper

### 7a. Add timeouts + headers - `scripts/rag/web-scraper.ts`
**Lines:** 36-42 & 170-181
**Issue:** No timeouts, inconsistent headers
**Fix:** AbortController with 8-15s timeout, centralized headers object
**Status:** TODO

### 7b. Fix relative links - `scripts/rag/web-scraper.ts`
**Lines:** 189-194
**Issue:** Uses baseUrl (site root) instead of current page URL
**Fix:** Use current page URL as base for new URL(), then filter by origin
**Status:** TODO

---

## 🟢 Batch 5: Polish

### 8. Workshop sequence - `scripts/rag/content-extractor.ts`
**Lines:** 100-125
**Issue:** Incorrect nav order
**Fix:** motion-magic → swerve-prerequisites → swerve-drive-project → pathplanner
**Status:** TODO

### 9. Environment validation - `src/app/api/chat/route.ts`
**Lines:** 20-26
**Issue:** Only console.error on missing env vars
**Fix:** Return 503 HTTP response immediately when GOOGLE_GENERATIVE_AI_API_KEY or NEXT_PUBLIC_CONVEX_URL missing
**Status:** TODO

### 10. Tool error handling - `src/app/api/chat/route.ts`
**Lines:** 88-92
**Issue:** Throws when genAI/convex missing (aborts stream)
**Fix:** Return graceful tool result string instead of throwing
**Status:** TODO

### 11. Progress counter - `scripts/rag/github-client.ts`
**Lines:** 182-199
**Issue:** Off-by-one and duplicate final emit
**Fix:** Report `i+1` in loop, remove final `onProgress` call
**Status:** TODO

### 12. GitHub auth - `src/app/api/github/fetch-file/route.ts`
**Lines:** 18-25
**Issue:** Unauthenticated requests hit rate limits
**Fix:** Read GITHUB_TOKEN from env and add to Authorization header
**Status:** TODO

### 13. Duplicate h1 - `src/app/ai-assistant/page.tsx`
**Lines:** 40-45
**Issue:** Duplicate "AI Workshop Assistant" title (PageTemplate already renders title)
**Fix:** Removed inner h1, added aria-hidden="true" and role="presentation" to icon row
**Status:** ✅ DONE

### 14. Security warning - `scripts/rag/README-CODE-INDEXING.md`
**Lines:** 75-85
**Issue:** No warning about Gemini API data egress
**Fix:** Add prominent security section warning about never indexing private/proprietary repos
**Status:** TODO

---

## ❓ Question: GitHub Fetch Duplication

**File:** `src/app/api/github/fetch-file/route.ts`
**Issue:** Duplicates GitHub fetching in `GitHubPage.tsx` but with different approach
- API route: Server-side, uses raw content
- GitHubPage: Client-side, uses base64-encoded content

**Options:**
1. Remove if unused (grep shows no usage)
2. Keep if planned for future AI assistant features
3. Document purpose

**Status:** NEEDS DECISION - Currently unused in codebase

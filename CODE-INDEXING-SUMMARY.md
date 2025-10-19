# Code Indexing Implementation - Complete ✅

## What We Built

A complete code indexing system for the Workshop RAG that fetches Java code from GitHub repositories, parses it intelligently, and makes it searchable through the AI Assistant.

---

## Files Created

### 1. **GitHub API Client** (`scripts/rag/github-client.ts`)
- ✅ Fetches repository file trees
- ✅ Downloads file contents from GitHub
- ✅ Handles rate limiting (60/hr without token, 5000/hr with `GITHUB_TOKEN`)
- ✅ Supports filtering by glob patterns
- ✅ Progress tracking callbacks

**Key Features:**
```typescript
const client = createGitHubClient({
  owner: "Hemlock5712",
  repo: "Workshop-Code",
  branch: "main"
});

const files = await client.getJavaFiles(); // Auto-filters .java in src/
const rateLimit = await client.getRateLimit(); // Check API limits
```

---

### 2. **Java Code Parser** (`scripts/rag/code-parser.ts`)
- ✅ Extracts package declarations
- ✅ Parses imports
- ✅ Identifies classes, methods, fields
- ✅ Extracts javadoc comments
- ✅ Tracks line numbers for each element

**Key Features:**
```typescript
const parsed = parseJavaFile(filePath, content);
// Returns: { package, imports, classes[] }

// Each class includes:
// - methods[] with signatures, parameters, javadoc
// - fields[] with types and modifiers
// - extends/implements relationships
```

---

### 3. **Code-Aware Chunker** (`scripts/rag/code-chunker.ts`)
- ✅ Never splits methods mid-implementation
- ✅ Includes class context (declaration + imports)
- ✅ Groups related methods together
- ✅ Preserves syntactic validity
- ✅ Targets ~800 tokens per chunk

**Chunking Strategy:**
```
Small class (< 800 tokens):
→ 1 chunk with full class

Medium class:
→ Multiple chunks, each with:
  - Package + imports
  - Class declaration
  - Single complete method

Large class:
→ Multiple chunks, each with:
  - Package + imports
  - Class declaration
  - Group of related methods
```

---

### 4. **Code Indexer** (`scripts/rag/code-indexer.ts`)
Main orchestration script that:
- ✅ Fetches files from GitHub
- ✅ Parses Java code structure
- ✅ Chunks with code-aware strategy
- ✅ Generates embeddings (Gemini text-embedding-004)
- ✅ Uploads to Convex database
- ✅ Provides detailed progress tracking

**Usage:**
```bash
# Pilot mode (Workshop-Code main branch only)
pnpm run generate-embeddings:code:pilot

# Full mode (all configured repos)
pnpm run generate-embeddings:code
```

---

### 5. **Repository Config** (`scripts/rag/code-repositories.ts`)
- ✅ Defines repositories to index
- ✅ Configurable include/exclude patterns
- ✅ Supports multiple branches
- ✅ Easy to add new repos

**Current Configuration:**
```typescript
// Enabled by default:
- Workshop-Code (main branch)

// Available (uncomment to enable):
- Workshop-Code feature branches (1-Setup, 2-Subsystems, etc.)
- Phoenix6-Examples (CTRE official examples)
```

---

### 6. **Documentation** (`scripts/rag/README-CODE-INDEXING.md`)
- ✅ Complete usage guide
- ✅ Architecture explanation
- ✅ Troubleshooting section
- ✅ Expected results
- ✅ Sample queries

---

### 7. **AI Assistant Enhancement** (`src/app/ai-assistant/page.tsx`)
Updated to include:
- ✅ Syntax highlighting for Java code with `react-syntax-highlighter`
- ✅ Theme-aware code display (dark/light mode)
- ✅ Inline code formatting
- ✅ External link icons for GitHub URLs
- ✅ Proper markdown rendering

**Features:**
```typescript
// Automatic language detection from markdown:
```java
public class Example { ... }
```

// Theme-aware styling:
- Dark mode: oneDark style
- Light mode: oneLight style

// External links get icons:
[View on GitHub](https://github.com/...) → 🔗
```

---

## Database Schema Updates

The existing Convex schema already supports code chunks:

```typescript
chunks: {
  content: string,
  embedding: array(768),
  pageTitle: string,
  pageUrl: string,
  sourceType: "workshop" | "docs" | "code",  // ← Code chunks use "code"
  contentType: "explanation" | "code" | "concept" | "example",
  language: "java",  // ← Language for syntax highlighting
  filePath: "src/main/java/...",
  githubUrl: "https://github.com/...",
  contentHash: string,  // For deduplication
}
```

---

## Expected Results

### After Running Code Indexer

**Workshop-Code (main branch):**
- ~10-15 Java files indexed
- ~40-60 code chunks created
- Files like:
  - `Robot.java`
  - `RobotContainer.java`
  - `Constants.java`
  - `subsystems/DriveSubsystem.java`
  - `commands/DriveCommand.java`

**Total Database:**
```
~230 total chunks:
├── Workshop pages: 59 chunks
├── External docs: 82 chunks
└── Code: ~90 chunks
```

---

## Sample AI Assistant Queries

After code indexing, users can ask:

### Code Examples
- "Show me a subsystem example"
  → Returns `DriveSubsystem.java` with syntax highlighting

- "How do I create a command?"
  → Returns `DriveCommand.java` + WPILib docs

- "What's in RobotContainer?"
  → Returns `RobotContainer.java` with full context

### Implementation Details
- "TalonFX configuration code"
  → Returns code snippets + CTRE docs

- "How to set up PID control?"
  → Returns code examples + PID explanation

- "Show me Motion Magic implementation"
  → Returns code from 4-MotionMagic branch

---

## How to Test

### 1. **Install Dependencies** (if needed)
```bash
pnpm install
```

### 2. **Set Environment Variables** (`.env.local`)
```bash
GEMINI_API_KEY=your_key
NEXT_PUBLIC_CONVEX_URL=your_url
GITHUB_TOKEN=your_token  # Optional but recommended
```

### 3. **Run Code Indexer**
```bash
# Test with pilot mode first (just Workshop-Code main)
pnpm run generate-embeddings:code:pilot
```

### 4. **Verify in Convex Dashboard**
Visit https://dashboard.convex.dev and check:
- Total chunks increased
- `sourceType: "code"` chunks exist
- `language: "java"` set correctly
- `githubUrl` points to GitHub

### 5. **Test AI Assistant**
Visit `/ai-assistant` and ask:
- "Show me a subsystem"
- "Example command code"
- "What's in Robot.java?"

Should return:
- ✅ Code chunks with syntax highlighting
- ✅ GitHub links in sources
- ✅ Properly formatted Java code

---

## Troubleshooting

### Issue: `tsx` not found
**Solution:** Ensure dependencies are installed:
```bash
pnpm install
# or
npm install
```

### Issue: GitHub rate limit
**Error:** "GitHub API rate limit exceeded"

**Solution:** Add `GITHUB_TOKEN` to `.env.local`:
1. Create token: https://github.com/settings/tokens
2. Needs `public_repo` scope
3. Add to `.env.local`: `GITHUB_TOKEN=ghp_...`

### Issue: No Java files found
**Solution:** Check repository configuration in `code-repositories.ts`:
- Verify owner/repo/branch names
- Check `includePatterns` and `excludePatterns`
- Confirm repository is public or token has access

### Issue: Parsing errors
**Note:** Some complex Java syntax may not parse (advanced generics, lambdas)
- Parser skips unparseable files
- Other files continue indexing
- Check console for specific error messages

---

## Package.json Scripts Added

```json
{
  "generate-embeddings:code": "tsx scripts/rag/code-indexer.ts",
  "generate-embeddings:code:pilot": "tsx scripts/rag/code-indexer.ts --pilot"
}
```

---

## Architecture Diagram

```
GitHub Repository (Hemlock5712/Workshop-Code)
          ↓
    GitHub Client
    (fetch .java files)
          ↓
     Java Parser
    (extract structure)
          ↓
    Code Chunker
    (smart chunking)
          ↓
   Embedding Generator
   (Gemini 768-dim)
          ↓
    Convex Database
    (vector storage)
          ↓
    AI Assistant
    (RAG retrieval)
          ↓
   User gets code!
   (with syntax highlighting)
```

---

## Next Steps

### Immediate
1. ✅ **Test the indexer** - Run pilot mode
2. ✅ **Verify database** - Check Convex dashboard
3. ✅ **Try AI Assistant** - Ask code questions

### Future Enhancements
- [ ] Add Phoenix6-Examples repository
- [ ] Index Workshop-Code feature branches (show progression)
- [ ] Add code context in responses (show full file structure)
- [ ] Implement semantic code search (by functionality)
- [ ] Add Python/TypeScript support

### Optional
- [ ] Add code quality metrics to chunks
- [ ] Include code complexity in retrieval
- [ ] Add "related code" suggestions
- [ ] Create code snippet library

---

## Summary

✅ **All components implemented:**
- GitHub API client with rate limiting
- Java code parser with structure extraction
- Code-aware chunker that preserves syntax
- Complete indexing pipeline
- AI Assistant with syntax highlighting
- Comprehensive documentation

🚀 **Ready to test:**
- Run `pnpm run generate-embeddings:code:pilot`
- Visit `/ai-assistant`
- Ask code-related questions
- Get syntax-highlighted Java code!

📚 **Documentation:**
- See `scripts/rag/README-CODE-INDEXING.md` for details
- Check code comments for implementation notes
- Review `code-repositories.ts` to add more repos

---

## Questions?

Refer to:
- `scripts/rag/README-CODE-INDEXING.md` - Detailed usage guide
- `CODE-INDEXING-SUMMARY.md` (this file) - Implementation overview
- Code comments in each file - Implementation details

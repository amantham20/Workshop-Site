# Code Indexing for RAG System

This document explains the code indexing system for the Workshop RAG implementation.

## Overview

The code indexing system fetches Java code from GitHub repositories, parses it intelligently, and chunks it for RAG retrieval. This allows the AI Assistant to answer questions with actual code examples from the Workshop-Code repository.

## Architecture

### Components

1. **GitHub Client** (`github-client.ts`)
   - Fetches repository file trees
   - Downloads file contents via GitHub API
   - Handles rate limiting (60 req/hr without token, 5000/hr with token)
   - Supports filtering by file patterns

2. **Java Parser** (`code-parser.ts`)
   - Extracts package, imports, classes
   - Parses method signatures and javadocs
   - Identifies fields and class relationships
   - Preserves code structure context

3. **Code Chunker** (`code-chunker.ts`)
   - Keeps full methods together (never splits mid-method)
   - Includes class context with each chunk
   - Preserves imports for understanding dependencies
   - Adds file path and GitHub URL metadata
   - Strategy:
     - Full class (if small enough < 800 tokens)
     - Class + single method (medium files)
     - Class + method groups (large files)

4. **Code Indexer** (`code-indexer.ts`)
   - Main script that orchestrates the pipeline
   - Fetches files from GitHub
   - Parses and chunks Java code
   - Generates embeddings
   - Uploads to Convex database

5. **Repository Config** (`code-repositories.ts`)
   - Defines which repositories to index
   - Configures include/exclude patterns
   - Supports multiple branches

## Repository Configuration

### Current Setup

**Pilot Mode** (for testing):
- Workshop-Code repository (main branch only)

**Full Mode** (production):
- Workshop-Code (main branch)
- Optional: Workshop-Code feature branches (1-Setup, 2-Subsystems, 3-Commands, 4-MotionMagic, 4-DynamicFlywheel)
- Optional: Phoenix6-Examples (CTRE examples)

Edit `code-repositories.ts` to enable/disable repositories:

```typescript
export const ALL_REPOSITORIES: CodeRepository[] = [
  WORKSHOP_CODE_MAIN,
  // Uncomment to add feature branches:
  // ...WORKSHOP_CODE_BRANCHES,
  // Uncomment to add Phoenix6 examples:
  // PHOENIX6_EXAMPLES,
];
```

## Usage

### Prerequisites

1. **Environment Variables** (`.env.local`):
   ```bash
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   GITHUB_TOKEN=your_github_token  # Optional but recommended for higher rate limits
   ```

2. **Install Dependencies**:
   ```bash
   pnpm install
   ```

### Running the Indexer

**Pilot mode** (Workshop-Code main branch only):
```bash
pnpm run generate-embeddings:code:pilot
```

**Full mode** (all configured repositories):
```bash
pnpm run generate-embeddings:code
```

### What Gets Indexed

For each repository, the indexer:
1. Fetches all `.java` files from `src/` directory
2. Parses package, imports, classes, methods, fields
3. Creates smart chunks:
   - Small classes: 1 chunk with full class
   - Medium classes: 1 chunk per method (with class context)
   - Large classes: Multiple chunks with grouped methods
4. Generates 768-dimensional embeddings (Gemini text-embedding-004)
5. Uploads to Convex with metadata:
   - `sourceType: "code"`
   - `language: "java"`
   - `filePath: "src/main/java/..."`
   - `githubUrl: "https://github.com/..."`
   - Class and method names

## Expected Results

### Workshop-Code (main branch)

Typical structure:
```
src/main/java/frc/robot/
├── Robot.java
├── RobotContainer.java
├── Constants.java
├── subsystems/
│   ├── DriveSubsystem.java
│   ├── ArmSubsystem.java
│   └── ShooterSubsystem.java
└── commands/
    ├── DriveCommand.java
    └── AutoCommands.java
```

Expected output:
- ~40-60 chunks
- ~10-15 Java files
- Avg chunk size: ~400-600 tokens

### Database After Indexing

```
Total chunks: ~230
├── Workshop pages: 59 chunks
├── External docs: 82 chunks
└── Code: ~90 chunks
```

## Sample Queries

After code indexing, the AI Assistant can answer:

- "Show me a subsystem example" → Returns DriveSubsystem.java
- "How do I create a command?" → Returns DriveCommand.java + WPILib docs
- "TalonFX configuration code" → Returns code + CTRE docs
- "What's in RobotContainer?" → Returns RobotContainer.java with full context

## Chunking Strategy Details

### Why Code-Aware Chunking?

Regular text chunking (split every N tokens) would:
- ❌ Split methods in the middle
- ❌ Lose class context
- ❌ Miss import statements
- ❌ Create syntactically invalid code

Code-aware chunking:
- ✅ Keeps methods intact
- ✅ Includes class declaration
- ✅ Preserves imports
- ✅ Maintains syntactic validity

### Chunk Types

1. **Full Class** (small files):
   ```java
   package frc.robot;
   import ...;

   public class Constants {
     // All fields and methods
   }
   ```

2. **Class + Method** (medium files):
   ```java
   package frc.robot.subsystems;
   import ...;

   public class DriveSubsystem extends SubsystemBase {
     // ... other methods and fields ...

     public void drive(double speed) {
       // Full method implementation
     }
   }
   ```

3. **Class + Method Group** (large files):
   ```java
   package frc.robot.subsystems;
   import ...;

   public class ComplexSubsystem extends SubsystemBase {
     // ... other methods ...

     public void methodA() { ... }
     public void methodB() { ... }
     public void methodC() { ... }
   }
   ```

## Troubleshooting

### Rate Limiting

**Problem**: "GitHub API rate limit exceeded"

**Solution**:
1. Add `GITHUB_TOKEN` to `.env.local`
2. Create token at: https://github.com/settings/tokens
3. Needs `public_repo` scope
4. Increases limit from 60/hr to 5000/hr

### Dependencies Not Found

**Problem**: "Cannot find module 'tsx'" or similar

**Solution**:
```bash
pnpm install
```

### No Files Found

**Problem**: "Found 0 Java files"

**Solution**:
1. Check repository exists: https://github.com/Hemlock5712/Workshop-Code
2. Check branch name in `code-repositories.ts`
3. Check include/exclude patterns

### Parsing Errors

**Problem**: "Failed to parse SomeFile.java"

**Solution**:
- Parser handles most Java syntax
- Some advanced syntax may fail (lambdas, complex generics)
- These files are skipped (won't break the whole indexing)

## Future Enhancements

- [ ] Add TypeScript/Python support
- [ ] Index feature branches to show progression
- [ ] Add Phoenix6-Examples for more CTRE code
- [ ] Implement semantic code search (by functionality)
- [ ] Add code context in AI responses with GitHub links

## File Reference

| File | Purpose | Location |
|------|---------|----------|
| GitHub Client | Fetch code from GitHub | `scripts/rag/github-client.ts` |
| Java Parser | Parse Java structure | `scripts/rag/code-parser.ts` |
| Code Chunker | Smart code chunking | `scripts/rag/code-chunker.ts` |
| Code Indexer | Main indexing script | `scripts/rag/code-indexer.ts` |
| Repo Config | Repository definitions | `scripts/rag/code-repositories.ts` |
| Embeddings | Generate embeddings | `scripts/rag/embeddings.ts` |
| Database Schema | Convex schema | `convex/schema.ts` |

## Testing

Run the test retrieval script to verify code chunks are searchable:

```bash
pnpm run test-retrieval
```

Try queries like:
- "subsystem"
- "command"
- "TalonFX"
- "drive"

Should return code chunks with GitHub URLs.

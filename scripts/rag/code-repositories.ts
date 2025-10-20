/**
 * Configuration for code repositories to index
 */

export interface CodeRepository {
  owner: string;
  repo: string;
  branch: string;
  description: string;
  includePatterns?: RegExp[]; // Patterns to include (if not specified, includes all .java files)
  excludePatterns?: RegExp[]; // Patterns to exclude
  sourceType: "workshop-code" | "example-code";
}

/**
 * Workshop-Code repository (main branch - final state)
 */
export const WORKSHOP_CODE_MAIN: CodeRepository = {
  owner: "Hemlock5712",
  repo: "Workshop-Code",
  branch: "main",
  description: "Final implementation of workshop robot code",
  includePatterns: [/^src\/main\/java\/.*\.java$/],
  excludePatterns: [/Test\.java$/, /tests?\//i],
  sourceType: "workshop-code",
};

/**
 * Workshop-Code feature branches (showing progression)
 */
export const WORKSHOP_CODE_BRANCHES: CodeRepository[] = [
  {
    owner: "Hemlock5712",
    repo: "Workshop-Code",
    branch: "1-Setup",
    description: "Workshop step 1: Initial project setup",
    includePatterns: [/^src\/main\/java\/.*\.java$/],
    sourceType: "workshop-code",
  },
  {
    owner: "Hemlock5712",
    repo: "Workshop-Code",
    branch: "2-Subsystems",
    description: "Workshop step 2: Building subsystems",
    includePatterns: [/^src\/main\/java\/.*\.java$/],
    sourceType: "workshop-code",
  },
  {
    owner: "Hemlock5712",
    repo: "Workshop-Code",
    branch: "3-Commands",
    description: "Workshop step 3: Adding commands",
    includePatterns: [/^src\/main\/java\/.*\.java$/],
    sourceType: "workshop-code",
  },
  {
    owner: "Hemlock5712",
    repo: "Workshop-Code",
    branch: "3-Limelight",
    description: "Workshop step 3 (vision): Limelight vision implementation",
    includePatterns: [/^src\/main\/java\/.*\.java$/],
    sourceType: "workshop-code",
  },
  {
    owner: "Hemlock5712",
    repo: "Workshop-Code",
    branch: "4-MotionMagic",
    description: "Workshop step 4: Motion Magic implementation",
    includePatterns: [/^src\/main\/java\/.*\.java$/],
    sourceType: "workshop-code",
  },
  {
    owner: "Hemlock5712",
    repo: "Workshop-Code",
    branch: "4-DynamicFlywheel",
    description: "Workshop step 4 (alt): Dynamic flywheel implementation",
    includePatterns: [/^src\/main\/java\/.*\.java$/],
    sourceType: "workshop-code",
  },
];

/**
 * Phoenix6-Examples repository
 */
export const PHOENIX6_EXAMPLES: CodeRepository = {
  owner: "CrossTheRoadElec",
  repo: "Phoenix6-Examples",
  branch: "main",
  description: "Official CTRE Phoenix 6 example projects",
  includePatterns: [
    /java\/.*Swerve.*\.java$/i,
    /java\/.*TalonFX.*\.java$/i,
    /java\/.*MotionMagic.*\.java$/i,
    /java\/.*Phoenix6.*\.java$/i,
  ],
  excludePatterns: [/Test\.java$/, /tests?\//i, /build\//],
  sourceType: "example-code",
};

/**
 * Workshop-Code with full implementation (4-MotionMagic has complete code)
 */
export const WORKSHOP_CODE_FULL: CodeRepository = {
  owner: "Hemlock5712",
  repo: "Workshop-Code",
  branch: "4-MotionMagic",
  description: "Complete workshop implementation with subsystems and commands",
  includePatterns: [/^src\/main\/java\/.*\.java$/],
  excludePatterns: [/Test\.java$/, /tests?\//i],
  sourceType: "workshop-code",
};

/**
 * Workshop-Code with Limelight vision implementation
 */
export const WORKSHOP_CODE_LIMELIGHT: CodeRepository = {
  owner: "Hemlock5712",
  repo: "Workshop-Code",
  branch: "3-Limelight",
  description: "Workshop implementation with Limelight vision subsystem",
  includePatterns: [/^src\/main\/java\/.*\.java$/],
  excludePatterns: [/Test\.java$/, /tests?\//i],
  sourceType: "workshop-code",
};

/**
 * All repositories to index (for production)
 */
export const ALL_REPOSITORIES: CodeRepository[] = [
  WORKSHOP_CODE_FULL,      // 4-MotionMagic - Complete workshop implementation
  WORKSHOP_CODE_LIMELIGHT, // 3-Limelight - Vision implementation
  // Uncomment to include all feature branches (shows progression)
  // ...WORKSHOP_CODE_BRANCHES,
  // Uncomment to include Phoenix6 examples
  // PHOENIX6_EXAMPLES,
];

/**
 * Pilot repositories (for testing)
 */
export const PILOT_REPOSITORIES: CodeRepository[] = [
  WORKSHOP_CODE_FULL,
  WORKSHOP_CODE_LIMELIGHT,
];

/**
 * Check if a file path matches repository filters
 */
export function shouldIncludeFile(
  filePath: string,
  repo: CodeRepository
): boolean {
  // Check exclude patterns first
  if (repo.excludePatterns) {
    for (const pattern of repo.excludePatterns) {
      if (pattern.test(filePath)) {
        return false;
      }
    }
  }

  // Check include patterns
  if (repo.includePatterns) {
    for (const pattern of repo.includePatterns) {
      if (pattern.test(filePath)) {
        return true;
      }
    }
    return false; // Didn't match any include pattern
  }

  // Default: include all .java files in src/
  return filePath.endsWith(".java") && filePath.startsWith("src/");
}

/**
 * Get repository display name
 */
export function getRepositoryName(repo: CodeRepository): string {
  return `${repo.owner}/${repo.repo}${repo.branch !== "main" ? `@${repo.branch}` : ""}`;
}

/**
 * Get GitHub URL for a file in a repository
 */
export function getGitHubFileUrl(
  repo: CodeRepository,
  filePath: string
): string {
  return `https://github.com/${repo.owner}/${repo.repo}/blob/${repo.branch}/${filePath}`;
}

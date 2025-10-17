/**
 * Extract content from workshop TSX pages for RAG indexing
 */

import fs from "fs";
import path from "path";

export interface ExtractedPage {
  title: string;
  url: string;
  content: string;
  sequencePosition?: number;
  prerequisites?: string[];
}

// Workshop page sequence (in learning order)
const WORKSHOP_SEQUENCE = [
  { path: "page.tsx", url: "/", title: "Home", position: 0 },
  {
    path: "introduction/page.tsx",
    url: "/introduction",
    title: "Introduction",
    position: 1,
  },
  {
    path: "prerequisites/page.tsx",
    url: "/prerequisites",
    title: "Prerequisites",
    position: 2,
  },
  {
    path: "mechanism-setup/page.tsx",
    url: "/mechanism-setup",
    title: "Mechanism Setup",
    position: 3,
  },
  {
    path: "mechanism-cad/page.tsx",
    url: "/mechanism-cad",
    title: "Mechanism CAD",
    position: 4,
  },
  {
    path: "hardware/page.tsx",
    url: "/hardware",
    title: "Hardware Setup",
    position: 5,
    prerequisites: ["mechanism-setup"],
  },
  {
    path: "project-setup/page.tsx",
    url: "/project-setup",
    title: "Project Setup",
    position: 6,
    prerequisites: ["hardware"],
  },
  {
    path: "building-subsystems/page.tsx",
    url: "/building-subsystems",
    title: "Building Subsystems",
    position: 7,
    prerequisites: ["project-setup"],
  },
  {
    path: "adding-commands/page.tsx",
    url: "/adding-commands",
    title: "Adding Commands",
    position: 8,
    prerequisites: ["building-subsystems"],
  },
  {
    path: "triggers/page.tsx",
    url: "/triggers",
    title: "Triggers",
    position: 9,
    prerequisites: ["adding-commands"],
  },
  {
    path: "command-framework/page.tsx",
    url: "/command-framework",
    title: "Command Framework",
    position: 10,
    prerequisites: ["triggers"],
  },
  {
    path: "running-program/page.tsx",
    url: "/running-program",
    title: "Running Program",
    position: 11,
    prerequisites: ["adding-commands"],
  },
  {
    path: "state-based/page.tsx",
    url: "/state-based",
    title: "State-Based Control",
    position: 12,
    prerequisites: ["command-framework"],
  },
  {
    path: "pid-control/page.tsx",
    url: "/pid-control",
    title: "PID Control",
    position: 13,
    prerequisites: ["building-subsystems"],
  },
  {
    path: "motion-magic/page.tsx",
    url: "/motion-magic",
    title: "Motion Magic",
    position: 14,
    prerequisites: ["pid-control"],
  },
  {
    path: "pathplanner/page.tsx",
    url: "/pathplanner",
    title: "PathPlanner",
    position: 15,
    prerequisites: ["motion-magic"],
  },
  {
    path: "swerve-drive-project/page.tsx",
    url: "/swerve-drive-project",
    title: "Swerve Drive Project",
    position: 16,
  },
  {
    path: "vision-options/page.tsx",
    url: "/vision-options",
    title: "Vision Options",
    position: 17,
  },
  {
    path: "vision-implementation/page.tsx",
    url: "/vision-implementation",
    title: "Vision Implementation",
    position: 18,
    prerequisites: ["vision-options"],
  },
  {
    path: "vision-shooting/page.tsx",
    url: "/vision-shooting",
    title: "Vision Shooting",
    position: 19,
    prerequisites: ["vision-implementation"],
  },
  {
    path: "logging-options/page.tsx",
    url: "/logging-options",
    title: "Logging Options",
    position: 20,
  },
  {
    path: "logging-implementation/page.tsx",
    url: "/logging-implementation",
    title: "Logging Implementation",
    position: 21,
    prerequisites: ["logging-options"],
  },
];

/**
 * Extract text content from TSX file
 * This is a simplified extraction - for production you might want to use a proper AST parser
 */
function extractTextFromTSX(tsxContent: string): string {
  let content = tsxContent;

  // Remove imports and exports
  content = content.replace(/^import\s+.*?from\s+['"].*?['"];?\s*$/gm, "");
  content = content.replace(/^export\s+(default\s+)?.*$/gm, "");

  // Extract string literals (content between quotes)
  const stringLiterals: string[] = [];
  const stringRegex = /["'`]([^"'`]+)["'`]/g;
  let match;
  while ((match = stringRegex.exec(content)) !== null) {
    if (match[1].length > 20) {
      // Only keep substantial text
      stringLiterals.push(match[1]);
    }
  }

  // Extract JSX text content (simplified)
  const jsxTextRegex = />([^<>{}]+)</g;
  while ((match = jsxTextRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text.length > 10 && !text.match(/^[a-z-]+$/)) {
      // Skip prop names
      stringLiterals.push(text);
    }
  }

  // Extract multi-line strings and template literals
  const multiLineRegex = /`([^`]+)`/g;
  while ((match = multiLineRegex.exec(content)) !== null) {
    if (match[1].length > 20) {
      stringLiterals.push(match[1]);
    }
  }

  // Deduplicate and join
  const uniqueContent = [...new Set(stringLiterals)];
  return uniqueContent.join("\n\n").trim();
}

/**
 * Extract content from a single workshop page
 */
export function extractPageContent(
  appDir: string,
  pageInfo: (typeof WORKSHOP_SEQUENCE)[0]
): ExtractedPage {
  const filePath = path.join(appDir, pageInfo.path);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Page file not found: ${filePath}`);
  }

  const tsxContent = fs.readFileSync(filePath, "utf-8");
  const content = extractTextFromTSX(tsxContent);

  return {
    title: pageInfo.title,
    url: pageInfo.url,
    content,
    sequencePosition: pageInfo.position,
    prerequisites: pageInfo.prerequisites,
  };
}

/**
 * Extract content from multiple workshop pages
 */
export function extractWorkshopPages(
  appDir: string,
  pageUrls?: string[]
): ExtractedPage[] {
  const pagesToExtract = pageUrls
    ? WORKSHOP_SEQUENCE.filter((page) => pageUrls.includes(page.url))
    : WORKSHOP_SEQUENCE;

  const extractedPages: ExtractedPage[] = [];

  for (const pageInfo of pagesToExtract) {
    try {
      const extracted = extractPageContent(appDir, pageInfo);
      extractedPages.push(extracted);
      console.log(`✓ Extracted: ${pageInfo.title}`);
    } catch (error) {
      console.error(`✗ Failed to extract ${pageInfo.title}:`, error);
    }
  }

  return extractedPages;
}

/**
 * Get workshop sequence information
 */
export function getWorkshopSequence() {
  return WORKSHOP_SEQUENCE;
}

/**
 * Code-aware chunking for Java files
 * Strategy: Keep full methods together, include class context, preserve imports
 */

import { JavaClass, JavaMethod, ParsedJavaFile } from "./code-parser";

export interface CodeChunk {
  content: string;
  metadata: CodeChunkMetadata;
}

export interface CodeChunkMetadata {
  filePath: string;
  githubUrl: string;
  package: string;
  className: string;
  methodName?: string;
  methods: string[]; // Names of all methods in this chunk
  imports: string[];
  contentType: "full-class" | "class-with-method" | "class-with-methods";
  language: "java";
  startLine: number;
  endLine: number;
  estimatedTokens: number;
}

export interface CodeChunkingConfig {
  maxTokens: number; // Target max tokens per chunk
  includeImports: boolean; // Include import statements in chunks
  includeClassContext: boolean; // Include class declaration with methods
  groupRelatedMethods: boolean; // Try to group related methods together
  minChunkSize: number; // Minimum chunk size in tokens
}

const DEFAULT_CONFIG: CodeChunkingConfig = {
  maxTokens: 800,
  includeImports: true,
  includeClassContext: true,
  groupRelatedMethods: true,
  minChunkSize: 100,
};

/**
 * Chunk a parsed Java file into retrievable code chunks
 */
export function chunkJavaFile(
  parsedFile: ParsedJavaFile,
  githubUrl: string,
  config: Partial<CodeChunkingConfig> = {}
): CodeChunk[] {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const chunks: CodeChunk[] = [];

  for (const javaClass of parsedFile.classes) {
    const classChunks = chunkClass(
      javaClass,
      parsedFile.filePath,
      githubUrl,
      parsedFile.imports,
      fullConfig
    );
    chunks.push(...classChunks);
  }

  return chunks;
}

/**
 * Chunk a single Java class
 */
function chunkClass(
  javaClass: JavaClass,
  filePath: string,
  githubUrl: string,
  fileImports: string[],
  config: CodeChunkingConfig
): CodeChunk[] {
  const chunks: CodeChunk[] = [];

  // If the entire class is small enough, create a single chunk
  const classTokens = estimateTokens(javaClass.fullContent);

  if (classTokens <= config.maxTokens) {
    chunks.push(
      createFullClassChunk(javaClass, filePath, githubUrl, fileImports, config)
    );
    return chunks;
  }

  // Otherwise, chunk by methods
  if (javaClass.methods.length === 0) {
    // Class with no methods (just fields/constants) - treat as full class
    chunks.push(
      createFullClassChunk(javaClass, filePath, githubUrl, fileImports, config)
    );
    return chunks;
  }

  // Try to group methods if enabled
  if (config.groupRelatedMethods) {
    const methodGroups = groupMethods(javaClass.methods, config.maxTokens);

    for (const methodGroup of methodGroups) {
      chunks.push(
        createMethodGroupChunk(
          javaClass,
          methodGroup,
          filePath,
          githubUrl,
          fileImports,
          config
        )
      );
    }
  } else {
    // Create a chunk for each method
    for (const method of javaClass.methods) {
      chunks.push(
        createMethodChunk(
          javaClass,
          method,
          filePath,
          githubUrl,
          fileImports,
          config
        )
      );
    }
  }

  return chunks;
}

/**
 * Create a chunk for the full class
 */
function createFullClassChunk(
  javaClass: JavaClass,
  filePath: string,
  githubUrl: string,
  fileImports: string[],
  config: CodeChunkingConfig
): CodeChunk {
  let content = "";

  // Add package
  if (javaClass.package) {
    content += `package ${javaClass.package};\n\n`;
  }

  // Add imports
  if (config.includeImports && fileImports.length > 0) {
    content += fileImports.map((imp) => `import ${imp};`).join("\n");
    content += "\n\n";
  }

  // Add class content
  content += javaClass.fullContent;

  return {
    content,
    metadata: {
      filePath,
      githubUrl,
      package: javaClass.package,
      className: javaClass.name,
      methods: javaClass.methods.map((m) => m.name),
      imports: fileImports,
      contentType: "full-class",
      language: "java",
      startLine: javaClass.startLine,
      endLine: javaClass.endLine,
      estimatedTokens: estimateTokens(content),
    },
  };
}

/**
 * Create a chunk for a single method with class context
 */
function createMethodChunk(
  javaClass: JavaClass,
  method: JavaMethod,
  filePath: string,
  githubUrl: string,
  fileImports: string[],
  config: CodeChunkingConfig
): CodeChunk {
  let content = "";

  // Add package
  if (javaClass.package) {
    content += `package ${javaClass.package};\n\n`;
  }

  // Add relevant imports (simplified - include all for now)
  if (config.includeImports && fileImports.length > 0) {
    content += fileImports.map((imp) => `import ${imp};`).join("\n");
    content += "\n\n";
  }

  // Add class context if enabled
  if (config.includeClassContext) {
    content += getClassHeader(javaClass);
    content += "\n\n  // ... other methods and fields ...\n\n";
  }

  // Add method
  content += indentCode(method.content, 2);

  if (config.includeClassContext) {
    content += "\n}";
  }

  return {
    content,
    metadata: {
      filePath,
      githubUrl,
      package: javaClass.package,
      className: javaClass.name,
      methodName: method.name,
      methods: [method.name],
      imports: fileImports,
      contentType: "class-with-method",
      language: "java",
      startLine: method.startLine,
      endLine: method.endLine,
      estimatedTokens: estimateTokens(content),
    },
  };
}

/**
 * Create a chunk for a group of related methods
 */
function createMethodGroupChunk(
  javaClass: JavaClass,
  methods: JavaMethod[],
  filePath: string,
  githubUrl: string,
  fileImports: string[],
  config: CodeChunkingConfig
): CodeChunk {
  let content = "";

  // Add package
  if (javaClass.package) {
    content += `package ${javaClass.package};\n\n`;
  }

  // Add imports
  if (config.includeImports && fileImports.length > 0) {
    content += fileImports.map((imp) => `import ${imp};`).join("\n");
    content += "\n\n";
  }

  // Add class context
  if (config.includeClassContext) {
    content += getClassHeader(javaClass);
    content += "\n\n  // ... other fields and methods ...\n\n";
  }

  // Add methods
  for (let i = 0; i < methods.length; i++) {
    content += indentCode(methods[i].content, 2);
    if (i < methods.length - 1) {
      content += "\n\n";
    }
  }

  if (config.includeClassContext) {
    content += "\n}";
  }

  const startLine = Math.min(...methods.map((m) => m.startLine));
  const endLine = Math.max(...methods.map((m) => m.endLine));

  return {
    content,
    metadata: {
      filePath,
      githubUrl,
      package: javaClass.package,
      className: javaClass.name,
      methods: methods.map((m) => m.name),
      imports: fileImports,
      contentType: "class-with-methods",
      language: "java",
      startLine,
      endLine,
      estimatedTokens: estimateTokens(content),
    },
  };
}

/**
 * Get class header (declaration only)
 */
function getClassHeader(javaClass: JavaClass): string {
  let header = "";

  // Add javadoc if present
  if (javaClass.javadoc) {
    header += "/**\n";
    header += javaClass.javadoc
      .split("\n")
      .map((line) => ` * ${line}`)
      .join("\n");
    header += "\n */\n";
  }

  // Add class declaration
  header += `public class ${javaClass.name}`;

  if (javaClass.extends) {
    header += ` extends ${javaClass.extends}`;
  }

  if (javaClass.implements.length > 0) {
    header += ` implements ${javaClass.implements.join(", ")}`;
  }

  header += " {";

  return header;
}

/**
 * Group methods by size to fit within token limits
 */
function groupMethods(
  methods: JavaMethod[],
  maxTokens: number
): JavaMethod[][] {
  const groups: JavaMethod[][] = [];
  let currentGroup: JavaMethod[] = [];
  let currentTokens = 0;

  // Estimate overhead for package, imports, class header
  const overhead = 200;

  for (const method of methods) {
    const methodTokens = estimateTokens(method.content);

    // If adding this method would exceed limit, start a new group
    if (
      currentTokens + methodTokens + overhead > maxTokens &&
      currentGroup.length > 0
    ) {
      groups.push(currentGroup);
      currentGroup = [method];
      currentTokens = methodTokens;
    } else {
      currentGroup.push(method);
      currentTokens += methodTokens;
    }
  }

  // Add the last group
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

/**
 * Estimate token count for code
 * Rough estimate: 1 token per 4 characters for code
 */
function estimateTokens(content: string): number {
  // Code typically has more tokens per character than natural language
  // Use a conservative estimate of 1 token per 3.5 characters
  return Math.ceil(content.length / 3.5);
}

/**
 * Indent code by a number of spaces
 */
function indentCode(code: string, spaces: number): string {
  const indent = " ".repeat(spaces);
  return code
    .split("\n")
    .map((line) => (line.trim() ? indent + line : line))
    .join("\n");
}

/**
 * Get chunk statistics
 */
export function getChunkStats(chunks: CodeChunk[]): {
  totalChunks: number;
  avgTokens: number;
  minTokens: number;
  maxTokens: number;
  fullClassChunks: number;
  methodChunks: number;
  methodGroupChunks: number;
} {
  if (chunks.length === 0) {
    return {
      totalChunks: 0,
      avgTokens: 0,
      minTokens: 0,
      maxTokens: 0,
      fullClassChunks: 0,
      methodChunks: 0,
      methodGroupChunks: 0,
    };
  }

  const tokens = chunks.map((c) => c.metadata.estimatedTokens);

  return {
    totalChunks: chunks.length,
    avgTokens: Math.round(tokens.reduce((a, b) => a + b, 0) / tokens.length),
    minTokens: Math.min(...tokens),
    maxTokens: Math.max(...tokens),
    fullClassChunks: chunks.filter(
      (c) => c.metadata.contentType === "full-class"
    ).length,
    methodChunks: chunks.filter(
      (c) => c.metadata.contentType === "class-with-method"
    ).length,
    methodGroupChunks: chunks.filter(
      (c) => c.metadata.contentType === "class-with-methods"
    ).length,
  };
}

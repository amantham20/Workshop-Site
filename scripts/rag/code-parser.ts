/**
 * Java code parser for extracting structure and metadata
 */

export interface JavaClass {
  name: string;
  package: string;
  extends?: string;
  implements: string[];
  javadoc?: string;
  methods: JavaMethod[];
  fields: JavaField[];
  imports: string[];
  startLine: number;
  endLine: number;
  fullContent: string;
}

export interface JavaMethod {
  name: string;
  returnType: string;
  parameters: JavaParameter[];
  modifiers: string[];
  javadoc?: string;
  content: string;
  startLine: number;
  endLine: number;
}

export interface JavaParameter {
  type: string;
  name: string;
}

export interface JavaField {
  name: string;
  type: string;
  modifiers: string[];
  initializer?: string;
}

export interface ParsedJavaFile {
  filePath: string;
  package: string;
  imports: string[];
  classes: JavaClass[];
  rawContent: string;
}

/**
 * Parse a Java file and extract structure
 */
export function parseJavaFile(
  filePath: string,
  content: string
): ParsedJavaFile {
  const lines = content.split("\n");

  // Extract package
  const packageMatch = content.match(/^\s*package\s+([\w.]+)\s*;/m);
  const packageName = packageMatch ? packageMatch[1] : "";

  // Extract imports
  const imports = extractImports(content);

  // Extract classes
  const classes = extractClasses(content, lines, packageName, imports);

  return {
    filePath,
    package: packageName,
    imports,
    classes,
    rawContent: content,
  };
}

/**
 * Extract import statements
 */
function extractImports(content: string): string[] {
  const importRegex = /^\s*import\s+(static\s+)?([\w.*]+)\s*;/gm;
  const imports: string[] = [];
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[2]);
  }

  return imports;
}

/**
 * Extract classes from Java file
 */
function extractClasses(
  content: string,
  lines: string[],
  packageName: string,
  imports: string[]
): JavaClass[] {
  const classes: JavaClass[] = [];

  // Match class declarations (including annotations)
  const classRegex =
    /(?:@[\w.]+(?:\([^)]*\))?\s*)*\s*(public\s+|private\s+|protected\s+)?(abstract\s+|final\s+)?(class|interface|enum)\s+(\w+)(?:\s+extends\s+([\w<>,\s]+))?(?:\s+implements\s+([\w<>,\s]+))?\s*\{/g;

  let match;
  while ((match = classRegex.exec(content)) !== null) {
    const modifiers = match[1]?.trim() || "";
    const classType = match[3];
    const className = match[4];
    const extendsClass = match[5]?.trim();
    const implementsInterfaces = match[6]
      ? match[6].split(",").map((i) => i.trim())
      : [];

    // Find class boundaries
    const classStart = match.index;
    const classEnd = findMatchingBrace(content, classStart + match[0].length);

    const classContent = content.substring(classStart, classEnd);
    const startLine = content.substring(0, classStart).split("\n").length;
    const endLine = content.substring(0, classEnd).split("\n").length;

    // Extract javadoc before class
    const javadoc = extractJavadoc(content, classStart);

    // Extract methods and fields
    const methods = extractMethods(classContent, startLine);
    const fields = extractFields(classContent);

    classes.push({
      name: className,
      package: packageName,
      extends: extendsClass,
      implements: implementsInterfaces,
      javadoc,
      methods,
      fields,
      imports,
      startLine,
      endLine,
      fullContent: classContent,
    });
  }

  return classes;
}

/**
 * Extract methods from class content
 */
function extractMethods(
  classContent: string,
  classStartLine: number
): JavaMethod[] {
  const methods: JavaMethod[] = [];

  // Match method declarations (including annotations)
  const methodRegex =
    /(?:@[\w.]+(?:\([^)]*\))?\s*)*\s*(public|private|protected)?\s*(static\s+)?(final\s+)?([\w<>,\s\[\]]+)\s+(\w+)\s*\(([^)]*)\)\s*(?:throws\s+[\w,\s]+)?\s*\{/g;

  let match;
  while ((match = methodRegex.exec(classContent)) !== null) {
    const modifiers = [match[1], match[2], match[3]]
      .filter(Boolean)
      .map((m) => m.trim());
    const returnType = match[4].trim();
    const methodName = match[5];
    const parametersStr = match[6].trim();

    // Skip if this looks like a constructor or not a method
    if (returnType === "class" || !returnType) {
      continue;
    }

    // Parse parameters
    const parameters = parseParameters(parametersStr);

    // Find method boundaries
    const methodStart = match.index;
    const methodEnd = findMatchingBrace(
      classContent,
      methodStart + match[0].length
    );

    const methodContent = classContent.substring(methodStart, methodEnd);
    const startLine =
      classStartLine +
      classContent.substring(0, methodStart).split("\n").length;
    const endLine =
      classStartLine + classContent.substring(0, methodEnd).split("\n").length;

    // Extract javadoc before method
    const javadoc = extractJavadoc(classContent, methodStart);

    methods.push({
      name: methodName,
      returnType,
      parameters,
      modifiers,
      javadoc,
      content: methodContent,
      startLine,
      endLine,
    });
  }

  return methods;
}

/**
 * Extract fields from class content
 */
function extractFields(classContent: string): JavaField[] {
  const fields: JavaField[] = [];

  // Match field declarations
  const fieldRegex =
    /(public|private|protected)?\s*(static\s+)?(final\s+)?([\w<>,\s\[\]]+)\s+(\w+)\s*(?:=\s*([^;]+))?\s*;/g;

  let match;
  while ((match = fieldRegex.exec(classContent)) !== null) {
    const modifiers = [match[1], match[2], match[3]]
      .filter(Boolean)
      .map((m) => m.trim());
    const type = match[4].trim();
    const name = match[5];
    const initializer = match[6]?.trim();

    // Skip if this looks like a local variable (inside a method)
    const beforeField = classContent.substring(0, match.index);
    const openBraces = (beforeField.match(/\{/g) || []).length;
    const closeBraces = (beforeField.match(/\}/g) || []).length;

    // If we're inside a method (more open braces than close), skip
    if (openBraces > closeBraces + 1) {
      continue;
    }

    fields.push({
      name,
      type,
      modifiers,
      initializer,
    });
  }

  return fields;
}

/**
 * Parse method parameters
 */
function parseParameters(parametersStr: string): JavaParameter[] {
  if (!parametersStr.trim()) {
    return [];
  }

  const params: JavaParameter[] = [];
  const paramParts = parametersStr.split(",");

  for (const part of paramParts) {
    const trimmed = part.trim();
    // Handle annotations like @Override, etc.
    const cleanParam = trimmed.replace(/@[\w.]+\s*/g, "");

    // Split into type and name
    const parts = cleanParam.split(/\s+/);
    if (parts.length >= 2) {
      const type = parts.slice(0, -1).join(" ");
      const name = parts[parts.length - 1];
      params.push({ type, name });
    }
  }

  return params;
}

/**
 * Extract javadoc comment before a position
 */
function extractJavadoc(content: string, position: number): string | undefined {
  const beforePosition = content.substring(0, position);
  const javadocMatch = beforePosition.match(/\/\*\*([\s\S]*?)\*\/\s*$/);

  if (javadocMatch) {
    // Clean up javadoc formatting
    return javadocMatch[1]
      .split("\n")
      .map((line) => line.trim().replace(/^\*\s?/, ""))
      .filter((line) => line.length > 0)
      .join("\n")
      .trim();
  }

  return undefined;
}

/**
 * Find matching closing brace
 */
function findMatchingBrace(content: string, startPos: number): number {
  let braceCount = 1;
  let pos = startPos;

  while (pos < content.length && braceCount > 0) {
    const char = content[pos];

    // Skip string literals
    if (char === '"' || char === "'") {
      pos = skipString(content, pos, char);
      continue;
    }

    // Skip comments
    if (char === "/" && content[pos + 1] === "/") {
      pos = skipLineComment(content, pos);
      continue;
    }

    if (char === "/" && content[pos + 1] === "*") {
      pos = skipBlockComment(content, pos);
      continue;
    }

    if (char === "{") {
      braceCount++;
    } else if (char === "}") {
      braceCount--;
    }

    pos++;
  }

  return pos;
}

/**
 * Skip string literal
 */
function skipString(content: string, startPos: number, quote: string): number {
  let pos = startPos + 1;
  while (pos < content.length) {
    const char = content[pos];
    if (char === quote && content[pos - 1] !== "\\") {
      return pos + 1;
    }
    pos++;
  }
  return pos;
}

/**
 * Skip line comment
 */
function skipLineComment(content: string, startPos: number): number {
  let pos = startPos;
  while (pos < content.length && content[pos] !== "\n") {
    pos++;
  }
  return pos + 1;
}

/**
 * Skip block comment
 */
function skipBlockComment(content: string, startPos: number): number {
  let pos = startPos + 2;
  while (pos < content.length - 1) {
    if (content[pos] === "*" && content[pos + 1] === "/") {
      return pos + 2;
    }
    pos++;
  }
  return pos;
}

/**
 * Get a summary of the parsed class
 */
export function getClassSummary(javaClass: JavaClass): string {
  const parts: string[] = [];

  // Class declaration
  parts.push(`Class: ${javaClass.package}.${javaClass.name}`);

  if (javaClass.extends) {
    parts.push(`Extends: ${javaClass.extends}`);
  }

  if (javaClass.implements.length > 0) {
    parts.push(`Implements: ${javaClass.implements.join(", ")}`);
  }

  // Methods
  if (javaClass.methods.length > 0) {
    parts.push("\nMethods:");
    for (const method of javaClass.methods) {
      const params = method.parameters
        .map((p) => `${p.type} ${p.name}`)
        .join(", ");
      parts.push(`  - ${method.returnType} ${method.name}(${params})`);
    }
  }

  // Fields
  if (javaClass.fields.length > 0) {
    parts.push("\nFields:");
    for (const field of javaClass.fields) {
      parts.push(`  - ${field.type} ${field.name}`);
    }
  }

  return parts.join("\n");
}

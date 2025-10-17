/**
 * Base web scraper utility for external documentation
 */

import * as cheerio from "cheerio";

export interface ScraperConfig {
  baseUrl: string;
  contentSelector: string; // CSS selector for main content
  removeSelectors?: string[]; // Elements to remove (nav, footer, etc.)
  maxPages?: number;
  delayMs?: number; // Rate limiting delay between requests
}

export interface ScrapedPage {
  url: string;
  title: string;
  content: string;
  section?: string;
  metadata: {
    framework?: string; // "sphinx", "docusaurus", etc.
    lastModified?: string;
  };
}

/**
 * Fetch and parse a single page
 */
export async function scrapePage(
  url: string,
  config: ScraperConfig
): Promise<ScrapedPage | null> {
  try {
    console.log(`Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Gray-Matter-Workshop-Bot/1.0 (Educational FRC Workshop Documentation Indexer)",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.statusText}`);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    const defaultRemoveSelectors = [
      "script",
      "style",
      "nav",
      "footer",
      ".navigation",
      ".navbar",
      ".sidebar",
      ".toc",
      ".edit-this-page",
      ".breadcrumbs",
      '[role="navigation"]',
      '[class*="header"]',
      '[class*="footer"]',
    ];

    const allRemoveSelectors = [
      ...defaultRemoveSelectors,
      ...(config.removeSelectors || []),
    ];

    allRemoveSelectors.forEach((selector) => {
      $(selector).remove();
    });

    // Extract main content
    const contentElement = $(config.contentSelector);
    if (!contentElement.length) {
      console.warn(`Content selector "${config.contentSelector}" not found in ${url}`);
      return null;
    }

    // Extract text content
    let content = contentElement.text();

    // Clean up whitespace
    content = content
      .replace(/\n\s*\n\s*\n/g, "\n\n") // Remove excessive newlines
      .replace(/[ \t]+/g, " ") // Normalize spaces
      .trim();

    if (content.length < 100) {
      console.warn(`Content too short (${content.length} chars) for ${url}`);
      return null;
    }

    // Extract title
    let title =
      $("h1").first().text().trim() ||
      $("title").text().trim() ||
      "Untitled Page";

    // Clean title
    title = title.split("|")[0].trim(); // Remove site name after |
    title = title.split("—")[0].trim(); // Remove site name after —

    // Try to extract section from URL or headings
    const urlParts = new URL(url).pathname.split("/").filter(Boolean);
    const section = urlParts[urlParts.length - 2] || undefined;

    // Detect documentation framework
    let framework: string | undefined;
    if ($('meta[name="generator"]').attr("content")?.includes("Sphinx")) {
      framework = "sphinx";
    } else if ($('[class*="docusaurus"]').length > 0) {
      framework = "docusaurus";
    } else if ($('[data-theme]').length > 0) {
      framework = "unknown";
    }

    return {
      url,
      title,
      content,
      section,
      metadata: {
        framework,
      },
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

/**
 * Scrape multiple pages with rate limiting
 */
export async function scrapePages(
  urls: string[],
  config: ScraperConfig,
  onProgress?: (completed: number, total: number) => void
): Promise<ScrapedPage[]> {
  const results: ScrapedPage[] = [];
  const delayMs = config.delayMs || 1000; // Default 1 second between requests

  for (let i = 0; i < urls.length; i++) {
    if (config.maxPages && i >= config.maxPages) {
      console.log(`Reached max pages limit: ${config.maxPages}`);
      break;
    }

    const page = await scrapePage(urls[i], config);
    if (page) {
      results.push(page);
    }

    onProgress?.(i + 1, urls.length);

    // Rate limiting delay (except for last page)
    if (i < urls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Extract links from a page (for sitemap crawling)
 */
export async function extractLinks(
  url: string,
  baseUrl: string,
  linkSelector: string = "a[href]"
): Promise<string[]> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const links = new Set<string>();

    $(linkSelector).each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        try {
          // Resolve relative URLs
          const absoluteUrl = new URL(href, baseUrl).toString();
          // Only include links from the same domain
          if (absoluteUrl.startsWith(baseUrl)) {
            links.add(absoluteUrl);
          }
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });

    return Array.from(links);
  } catch (error) {
    console.error(`Error extracting links from ${url}:`, error);
    return [];
  }
}

/**
 * Clean HTML content for better text extraction
 */
export function cleanHtmlContent(html: string): string {
  const $ = cheerio.load(html);

  // Remove code blocks temporarily (we'll handle them separately)
  const codeBlocks: string[] = [];
  $("pre code, pre").each((i, elem) => {
    const code = $(elem).text();
    codeBlocks.push(code);
    $(elem).replaceWith(`__CODE_BLOCK_${i}__`);
  });

  // Get text content
  let text = $("body").text();

  // Restore code blocks
  codeBlocks.forEach((code, i) => {
    text = text.replace(`__CODE_BLOCK_${i}__`, `\n\`\`\`\n${code}\n\`\`\`\n`);
  });

  return text;
}

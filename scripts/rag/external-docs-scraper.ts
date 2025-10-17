/**
 * Scraper for external documentation referenced in workshop
 */

import {
  scrapePages,
  type ScraperConfig,
  type ScrapedPage,
} from "./web-scraper";
import {
  ALL_EXTERNAL_URLS,
  EXTERNAL_DOC_URLS,
  getVendorFromUrl,
} from "./external-docs-urls";

/**
 * Scraper configurations for each documentation site
 */
const SCRAPER_CONFIGS: Record<string, ScraperConfig> = {
  // CTRE Phoenix 6 - Sphinx with Furo theme
  ctre: {
    baseUrl: "https://v6.docs.ctr-electronics.com",
    contentSelector: "#furo-main-content, main, article",
    removeSelectors: [
      ".headerlink",
      ".toctree-wrapper",
      "#furo-sidebar-brand-text",
      ".related-pages",
      '[role="navigation"]',
    ],
    delayMs: 1500,
  },

  // WPILib - Sphinx with Read the Docs theme
  wpilib: {
    baseUrl: "https://docs.wpilib.org",
    contentSelector: '[role="main"], .document, main, article',
    removeSelectors: [
      ".headerlink",
      ".toctree-wrapper",
      '[role="navigation"]',
      ".rst-footer-buttons",
      ".ethical-rtd",
    ],
    delayMs: 1500,
  },

  // PathPlanner - Custom docs site
  pathplanner: {
    baseUrl: "https://pathplanner.dev",
    contentSelector: "main, article, .content, body",
    removeSelectors: [
      "nav",
      "header",
      "footer",
      '[role="navigation"]',
      ".navigation",
    ],
    delayMs: 1500,
  },

  // Limelight - Docusaurus
  limelight: {
    baseUrl: "https://docs.limelightvision.io",
    contentSelector: "article, .theme-doc-markdown, main",
    removeSelectors: [
      "nav",
      ".theme-doc-toc-mobile",
      ".theme-doc-breadcrumbs",
      ".pagination-nav",
      '[role="navigation"]',
    ],
    delayMs: 1500,
  },

  // PhotonVision - Sphinx with Furo theme
  photonvision: {
    baseUrl: "https://docs.photonvision.org",
    contentSelector: "#furo-main-content, main, article",
    removeSelectors: [
      ".headerlink",
      ".toctree-wrapper",
      "#furo-sidebar-brand-text",
      ".related-pages",
      '[role="navigation"]',
    ],
    delayMs: 1500,
  },
};

/**
 * Get the appropriate scraper config for a URL
 */
function getConfigForUrl(url: string): ScraperConfig {
  if (url.includes("ctr-electronics.com") || url.includes("readthedocs.build"))
    return SCRAPER_CONFIGS.ctre;
  if (url.includes("wpilib.org")) return SCRAPER_CONFIGS.wpilib;
  if (url.includes("pathplanner.dev")) return SCRAPER_CONFIGS.pathplanner;
  if (url.includes("limelightvision.io")) return SCRAPER_CONFIGS.limelight;
  if (url.includes("photonvision.org")) return SCRAPER_CONFIGS.photonvision;

  // Fallback config
  return {
    baseUrl: new URL(url).origin,
    contentSelector: "main, article, .content",
    delayMs: 1500,
  };
}

/**
 * Scrape a specific vendor's documentation
 */
export async function scrapeVendorDocs(
  vendor: keyof typeof EXTERNAL_DOC_URLS,
  onProgress?: (completed: number, total: number) => void
): Promise<ScrapedPage[]> {
  const urls = EXTERNAL_DOC_URLS[vendor];
  console.log(`\n📚 Scraping ${vendor.toUpperCase()} documentation...`);
  console.log(`📄 Pages to scrape: ${urls.length}`);

  const config = SCRAPER_CONFIGS[vendor];
  const pages = await scrapePages(urls, config, onProgress);

  // Add vendor metadata
  const pagesWithVendor = pages.map((page) => ({
    ...page,
    metadata: {
      ...page.metadata,
      vendor: getVendorFromUrl(page.url),
    },
  }));

  console.log(
    `✅ Successfully scraped ${pagesWithVendor.length}/${urls.length} pages`
  );

  return pagesWithVendor;
}

/**
 * Scrape all external documentation
 */
export async function scrapeAllExternalDocs(
  onProgress?: (completed: number, total: number, vendor: string) => void
): Promise<ScrapedPage[]> {
  console.log("\n🌐 Starting external documentation scraping...");
  console.log(`📄 Total pages to scrape: ${ALL_EXTERNAL_URLS.length}`);
  console.log(`📚 Vendors: CTRE, WPILib, PathPlanner, Limelight, PhotonVision\n`);

  const allPages: ScrapedPage[] = [];
  let completedTotal = 0;

  const vendors = Object.keys(
    EXTERNAL_DOC_URLS
  ) as (keyof typeof EXTERNAL_DOC_URLS)[];

  for (const vendor of vendors) {
    const pages = await scrapeVendorDocs(vendor, (completed, total) => {
      onProgress?.(completedTotal + completed, ALL_EXTERNAL_URLS.length, vendor);
    });

    allPages.push(...pages);
    completedTotal += EXTERNAL_DOC_URLS[vendor].length;
  }

  console.log(`\n✅ Total pages scraped: ${allPages.length}/${ALL_EXTERNAL_URLS.length}`);

  return allPages;
}

/**
 * Test script to check which external docs can be scraped
 * Reports success/failure for each vendor without uploading to Convex
 */

import { scrapeAllExternalDocs } from "./rag/external-docs-scraper.ts";

console.log("🧪 Testing external documentation scraping...\n");
console.log("This will attempt to scrape all configured documentation sites");
console.log("and report which ones succeed or fail.\n");

try {
  const scrapedPages = await scrapeAllExternalDocs((completed, total, vendor) => {
    process.stdout.write(
      `\r   Progress: ${completed}/${total} (${Math.round((completed / total) * 100)}%) - Current: ${vendor}    `
    );
  });

  console.log("\n\n📊 Scraping Results:");
  console.log(`   ✅ Successfully scraped: ${scrapedPages.length} pages`);

  // Group by vendor
  const byVendor = scrapedPages.reduce((acc, page) => {
    const vendor = page.metadata?.vendor || "Unknown";
    acc[vendor] = (acc[vendor] || 0) + 1;
    return acc;
  }, {});

  console.log("\n   By vendor:");
  for (const [vendor, count] of Object.entries(byVendor)) {
    console.log(`     ${vendor}: ${count} pages`);
  }

  console.log("\n✅ All tests complete!");
} catch (error) {
  console.error("\n❌ Error during scraping test:", error);
  process.exit(1);
}

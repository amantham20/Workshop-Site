/**
 * Convex client setup for the browser
 */

import { ConvexHttpClient } from "convex/browser";

// Singleton Convex client
let convexClient: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient {
  if (!convexClient) {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

    if (!convexUrl) {
      throw new Error(
        "NEXT_PUBLIC_CONVEX_URL environment variable is required"
      );
    }

    convexClient = new ConvexHttpClient(convexUrl);
  }

  return convexClient;
}

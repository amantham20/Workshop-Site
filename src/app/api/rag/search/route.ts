/**
 * API route for RAG vector search
 */

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const { embedding, limit, sourceType } = await req.json();

    if (!embedding || !Array.isArray(embedding)) {
      return NextResponse.json(
        { error: "Invalid embedding provided" },
        { status: 400 }
      );
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

    if (!convexUrl) {
      return NextResponse.json(
        { error: "Convex URL not configured" },
        { status: 500 }
      );
    }

    // Initialize Convex client
    const convex = new ConvexHttpClient(convexUrl);

    // Perform vector search using Convex action
    const results = await convex.action(api.chunks.vectorSearch, {
      embedding,
      limit: limit || 5,
      sourceType: sourceType || undefined,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("RAG search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

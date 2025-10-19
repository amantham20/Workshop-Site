/**
 * API route for generating embeddings (server-side)
 */

import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.error("GOOGLE_GENERATIVE_AI_API_KEY not configured in environment");
}

const genAI = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function POST(request: NextRequest) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Generate embedding
    const result = await genAI.models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });

    return NextResponse.json({
      embedding: result.embeddings?.[0]?.values || [],
    });
  } catch (error) {
    console.error("Error generating embedding:", error);
    return NextResponse.json(
      { error: "Failed to generate embedding" },
      { status: 500 }
    );
  }
}

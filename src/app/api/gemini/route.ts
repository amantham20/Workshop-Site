import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, context } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Build the prompt with optional context
    let prompt = question;
    if (context && context.length > 0) {
      prompt = `You are an FRC programming workshop assistant with access to comprehensive documentation including workshop materials, official vendor documentation, and code examples.

IMPORTANT INSTRUCTIONS:
- Answer based on the provided context from the Gray Matter Workshop documentation and external resources
- Always cite your sources by referencing the specific documentation sections provided
- Use code snippets from the context when relevant
- If the context contains information from multiple sources (workshop pages, CTRE docs, WPILib docs, etc.), synthesize the information clearly
- If the question cannot be fully answered with the provided context, acknowledge what information is available and what isn't
- Be precise and technical - this is for FRC teams learning to program robots

Question: ${question}

Context from documentation:
${context}

Please provide a comprehensive answer with proper citations to the sources above.`;
    } else {
      prompt = `You are an FRC programming workshop assistant. The user asked: "${question}"

However, no relevant information was found in the indexed documentation for this question. Please provide general FRC programming guidance based on your knowledge, but clearly state that this is general information and not from the specific workshop documentation or indexed external resources.`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

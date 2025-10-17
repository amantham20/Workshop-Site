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
      prompt = `You are an FRC programming workshop assistant. Answer the following question based on the code examples provided from the Workshop-Code repository.

IMPORTANT INSTRUCTIONS:
- Reference the specific code files when answering
- If the question asks about a topic that isn't covered in the provided code (like vision, swerve drive, etc.), clearly state: "This topic isn't implemented in the current workshop code examples."
- You can provide general FRC knowledge, but make it clear what comes from the code vs general knowledge
- Use code snippets from the provided files when relevant

Question: ${question}

Workshop Code Examples:
${context}`;
    } else {
      prompt = `You are an FRC programming workshop assistant. The user asked: "${question}"

However, no relevant code examples were found in the Workshop-Code repository for this question. Please provide general FRC programming guidance, but make it clear that this information is general knowledge and not from the specific workshop code.`;
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

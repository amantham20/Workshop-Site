import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: "Failed to fetch models", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    interface GeminiModel {
      name: string;
      displayName: string;
      description?: string;
      supportedGenerationMethods?: string[];
    }

    return NextResponse.json({
      models: (data.models as GeminiModel[])
        .filter((model) =>
          model.supportedGenerationMethods?.includes("generateContent")
        )
        .map((model) => ({
          name: model.name,
          displayName: model.displayName,
          description: model.description,
          supportedGenerationMethods: model.supportedGenerationMethods,
        })),
    });
  } catch (error) {
    console.error("Error listing models:", error);
    return NextResponse.json(
      { error: "Failed to list models", details: String(error) },
      { status: 500 }
    );
  }
}

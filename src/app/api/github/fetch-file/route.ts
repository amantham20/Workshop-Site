import { NextRequest, NextResponse } from "next/server";

const REPO_OWNER = "Hemlock5712";
const REPO_NAME = "Workshop-Code";
const DEFAULT_BRANCH = "4-MotionMagic";

export async function POST(req: NextRequest) {
  try {
    const { filePath, branch = DEFAULT_BRANCH } = await req.json();

    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${branch}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/vnd.github.v3.raw",
        "User-Agent": "Workshop-Site",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch file: ${response.statusText}` },
        { status: response.status }
      );
    }

    const content = await response.text();

    return NextResponse.json({
      content,
      path: filePath,
      branch,
    });
  } catch (error) {
    console.error("GitHub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch file from GitHub" },
      { status: 500 }
    );
  }
}

/**
 * Quick test to see what code chunks we have
 */

import { ConvexHttpClient } from "convex/browser";

const convexUrl = "https://useful-boar-291.convex.cloud";
const convex = new ConvexHttpClient(convexUrl);

// Get all chunks
const chunks = await convex.query("chunks:getStats");

console.log("\n📊 Database Stats:");
console.log("Total chunks:", chunks.totalChunks);
console.log("By source type:", chunks.bySourceType);
console.log("By content type:", chunks.byContentType);

// Try to get code-specific info
console.log("\n🔍 Testing code chunk retrieval...");

// We'd need to manually query for code chunks
// For now, let's just confirm the stats show we have 3 code chunks
if (chunks.bySourceType.code === 3) {
  console.log(
    "✅ We have 3 code chunks (Main.java, Robot.java, RobotContainer.java)"
  );
  console.log(
    "⚠️  These are from the 'main' branch which only has starter files"
  );
  console.log("⚠️  No subsystems, commands, or Limelight code indexed yet!");
} else {
  console.log("❌ Expected 3 code chunks, got:", chunks.bySourceType.code);
}

console.log("\n💡 To get actual workshop code:");
console.log(
  "1. We need to index feature branches (3-Limelight, 4-MotionMagic, etc.)"
);
console.log("2. Or index the full implementation from a complete branch");

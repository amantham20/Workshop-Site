/**
 * External documentation URLs referenced in workshop pages
 * These are the specific pages linked from the workshop content
 */

export const EXTERNAL_DOC_URLS = {
  // CTRE Phoenix 6 Documentation
  ctre: [
    "https://v6.docs.ctr-electronics.com/",
    "https://v6.docs.ctr-electronics.com/en/stable/docs/canivore/canivore-intro.html",
    "https://v6.docs.ctr-electronics.com/en/stable/docs/api-reference/",
    "https://v6.docs.ctr-electronics.com/en/stable/docs/tuner/",
    "https://v6.docs.ctr-electronics.com/en/stable/docs/tuner/connecting.html",
    "https://v6.docs.ctr-electronics.com/en/stable/docs/hardware-reference/talonfx/improving-performance-with-current-limits.html",
    "https://v6.docs.ctr-electronics.com/en/latest/docs/api-reference/device-specific/talonfx/motion-magic.html",
    "https://v6.docs.ctr-electronics.com/en/latest/docs/tuner/tuner-swerve/index.html",
    "https://phoenixpro-documentation--161.org.readthedocs.build/en/161/docs/application-notes/manual-pid-tuning.html",
  ],

  // WPILib Documentation
  wpilib: [
    "https://docs.wpilib.org/en/stable/docs/zero-to-robot/step-2/wpilib-setup.html",
    "https://docs.wpilib.org/en/stable/docs/software/commandbased/index.html",
    "https://docs.wpilib.org/en/stable/docs/software/commandbased/commands.html",
    "https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html",
    "https://docs.wpilib.org/en/stable/docs/software/telemetry/robot-telemetry-with-annotations.html",
    "https://docs.wpilib.org/en/stable/docs/software/telemetry/datalog.html",
    "https://docs.wpilib.org/en/stable/docs/software/dashboards/smartdashboard/index.html",
    "https://docs.wpilib.org/en/stable/docs/software/networktables/index.html",
    "https://docs.wpilib.org/en/stable/docs/software/kinematics-and-odometry/swerve-drive-odometry.html",
    "https://docs.wpilib.org/en/stable/docs/software/advanced-controls/state-space/state-space-pose-estimators.html",
  ],

  // PathPlanner Documentation
  pathplanner: [
    "https://pathplanner.dev/home.html",
    "https://pathplanner.dev/pplib-getting-started.html",
    "https://pathplanner.dev/robot-config.html",
  ],

  // Limelight Documentation
  limelight: [
    "https://docs.limelightvision.io/docs/docs-limelight/apis/complete-networktables-api",
  ],
};

// Flatten all URLs into a single array
export const ALL_EXTERNAL_URLS = [
  ...EXTERNAL_DOC_URLS.ctre,
  ...EXTERNAL_DOC_URLS.wpilib,
  ...EXTERNAL_DOC_URLS.pathplanner,
  ...EXTERNAL_DOC_URLS.limelight,
];

// Get vendor name from URL
export function getVendorFromUrl(url: string): string {
  if (url.includes("ctr-electronics.com") || url.includes("readthedocs.build"))
    return "CTRE";
  if (url.includes("wpilib.org")) return "WPILib";
  if (url.includes("pathplanner.dev")) return "PathPlanner";
  if (url.includes("limelightvision.io")) return "Limelight";
  return "Unknown";
}

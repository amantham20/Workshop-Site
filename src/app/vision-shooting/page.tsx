import ComingSoonPage from "@/components/ComingSoonPage";

export default function VisionShooting() {
  return (
    <ComingSoonPage
      title="Vision-Based Shooting"
      previousPage={{
        href: "/swerve-calibration",
        title: "Odom Calibration",
      }}
      nextPage={{ href: "/state-based", title: "State-Based Control" }}
    />
  );
}

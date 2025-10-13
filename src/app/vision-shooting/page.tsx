import ComingSoonPage from "@/components/ComingSoonPage";

export default function VisionShooting() {
  return (
    <ComingSoonPage
      title="Vision-Based Shooting"
      previousPage={{
        href: "/motion-magic",
        title: "Motion Magic",
      }}
      nextPage={{ href: "/state-based", title: "State-Based Control" }}
    />
  );
}

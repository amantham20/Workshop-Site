import ComingSoonPage from "@/components/ComingSoonPage";

export default function VisionShooting() {
  return (
    <ComingSoonPage
      title="Vision-Based Shooting"
      previousPage={{
        href: "/vision-implementation",
        title: "Implementing Vision",
      }}
      nextPage={{ href: "/state-based", title: "State-Based Control" }}
    />
  );
}

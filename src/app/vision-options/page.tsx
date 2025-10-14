import PageTemplate from "@/components/PageTemplate";
import KeyConceptSection from "@/components/KeyConceptSection";
import ContentCard from "@/components/ContentCard";
import ConceptBox from "@/components/ConceptBox";
import AlertBox from "@/components/AlertBox";
import DocumentationButton from "@/components/DocumentationButton";

export default function VisionOptions() {
  return (
    <PageTemplate
      title="Vision Options"
      previousPage={{
        href: "/logging-implementation",
        title: "Implementing Logging",
      }}
      nextPage={{
        href: "/vision-implementation",
        title: "Implementing Vision",
      }}
    >
      <KeyConceptSection
        title="Computer Vision - See the Field"
        description="Computer vision enables robots to detect game pieces, track targets, and localize position using cameras. AprilTag targets provide absolute field positioning, while object detection helps with game piece manipulation."
        concept="Vision transforms robots from blind machines into field-aware systems that can adapt to dynamic conditions."
      />

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Why Vision Matters in FRC
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <ConceptBox title="Absolute Positioning">
            AprilTags provide known field positions, enabling accurate robot
            localization and drift correction for odometry.
          </ConceptBox>
          <ConceptBox title="Game Piece Detection">
            Detect and track notes, cones, cubes, or other game pieces for
            autonomous pickup and scoring.
          </ConceptBox>
          <ConceptBox title="Target Tracking">
            Aim and shoot at targets dynamically, adjusting for robot and target
            movement in real-time.
          </ConceptBox>
        </div>

        <AlertBox
          variant="info"
          title="💡 Vision is Essential for Competitive Play"
        >
          <p>
            Modern FRC competition requires vision for autonomous accuracy and
            teleop assistance. Top teams use multiple cameras for comprehensive
            field awareness.
          </p>
        </AlertBox>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          FRC Vision System Options
        </h2>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-primary-600 text-white rounded-lg px-4 py-2 font-bold text-lg">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Limelight
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Dedicated vision hardware with integrated processing, LEDs, and
                NetworkTables interface. Plug-and-play solution optimized for
                FRC.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                ✅ Advantages
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Zero code required for basic detection</li>
                <li>Built-in LED ring for consistent lighting</li>
                <li>Hardware-accelerated processing</li>
                <li>Web interface for tuning pipelines</li>
                <li>NetworkTables integration out-of-box</li>
                <li>Proven reliability in competition</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                ⚠️ Limitations
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Higher cost (~$400-500)</li>
                <li>Proprietary hardware and software</li>
                <li>Limited customization vs open source</li>
                <li>Requires mounting and wiring</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              🎯 Best For
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Teams who want reliable, proven vision hardware with minimal
              setup. Ideal for teams prioritizing ease-of-use over cost.
            </p>
          </div>

          <div className="mt-6">
            <DocumentationButton
              href="https://docs.limelightvision.io/"
              title="Limelight Documentation"
              icon="📖"
            />
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-green-600 text-white rounded-lg px-4 py-2 font-bold text-lg">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                PhotonVision
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Open-source vision software that runs on coprocessors (Raspberry
                Pi, Orange Pi, etc.). Flexible and cost-effective alternative.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                ✅ Advantages
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Free and open source</li>
                <li>Works with any USB camera</li>
                <li>Active development and community</li>
                <li>Advanced AprilTag support</li>
                <li>Multi-tag pose estimation</li>
                <li>Lower total cost (~$100-150)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                ⚠️ Limitations
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Requires coprocessor setup</li>
                <li>More configuration complexity</li>
                <li>Camera and lighting selection matters</li>
                <li>Performance depends on hardware chosen</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
              🎯 Best For
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Teams who want cost-effective vision with flexibility and
              don&apos;t mind additional setup complexity. Great for AprilTag
              localization.
            </p>
          </div>

          <div className="mt-6">
            <DocumentationButton
              href="https://docs.photonvision.org/"
              title="PhotonVision Documentation"
              icon="📖"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Vision System Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 dark:border-slate-700">
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-slate-100">
                  Feature
                </th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-slate-100">
                  Limelight
                </th>
                <th className="text-left p-4 font-semibold text-slate-900 dark:text-slate-100">
                  PhotonVision
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                  Cost
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  $400-500
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  $100-150
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                  Setup Complexity
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Very Easy
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Moderate
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                  Hardware
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Integrated unit
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Coprocessor + Camera
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                  LED Illumination
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Built-in LED ring
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  External LEDs if needed
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                  AprilTag Support
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Yes</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Yes (Advanced)
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                  Custom Pipelines
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Web interface
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Web interface + Code
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                  Community Support
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Large, established
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Growing, active
                </td>
              </tr>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <td className="p-4 font-medium text-slate-900 dark:text-slate-100">
                  Best Use Case
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Plug-and-play reliability
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">
                  Cost-effective flexibility
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          AprilTag Localization
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          AprilTags are fiducial markers placed at known locations on the FRC
          field. Cameras can detect these tags and calculate the robot&apos;s
          absolute field position.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <ContentCard>
            <h3 className="text-xl font-bold text-primary-900 dark:text-primary-300 mb-4">
              How AprilTags Work
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Tags have unique IDs corresponding to field positions</li>
              <li>Camera detects tag and calculates relative pose</li>
              <li>Robot position computed from known tag location</li>
              <li>Multiple tags improve accuracy through fusion</li>
            </ul>
          </ContentCard>

          <ContentCard>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-4">
              Benefits for FRC
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Corrects odometry drift automatically</li>
              <li>Enables accurate autonomous navigation</li>
              <li>Works regardless of starting position</li>
              <li>Provides absolute field coordinates</li>
            </ul>
          </ContentCard>
        </div>

        <AlertBox variant="tip" title="💡 Multi-Camera Setup">
          <p>
            Many top teams use multiple cameras: one facing forward for game
            pieces, and others positioned to always see AprilTags for continuous
            localization.
          </p>
        </AlertBox>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Recommended Approach for This Workshop
        </h2>

        <div className="bg-primary-50 dark:bg-primary-950/30 rounded-lg p-8 border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            📷 Using Limelight
          </h3>

          <p className="text-slate-600 dark:text-slate-300 mb-6">
            For this workshop, we&apos;ll use Limelight for its simplicity and
            reliability. The focus is on integrating vision data into your robot
            code, not configuring vision hardware.
          </p>

          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-3">
              What You&apos;ll Learn
            </h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Reading vision data from NetworkTables</li>
              <li>Integrating AprilTag poses into odometry</li>
              <li>Using vision for target tracking</li>
              <li>Commanding turrets/shooters based on vision</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Additional Resources
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <DocumentationButton
            href="https://docs.limelightvision.io/"
            title="Limelight Documentation"
            icon="📖"
          />
          <DocumentationButton
            href="https://docs.photonvision.org/"
            title="PhotonVision Documentation"
            icon="🔧"
          />
          <DocumentationButton
            href="https://docs.wpilib.org/en/stable/docs/software/vision-processing/index.html"
            title="WPILib Vision Processing"
            icon="📊"
          />
          <DocumentationButton
            href="https://april.eecs.umich.edu/software/apriltag"
            title="AprilTag Information"
            icon="🏷️"
          />
        </div>
      </section>
    </PageTemplate>
  );
}

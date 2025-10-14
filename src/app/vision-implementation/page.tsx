import PageTemplate from "@/components/PageTemplate";
import KeyConceptSection from "@/components/KeyConceptSection";
import AlertBox from "@/components/AlertBox";
import CollapsibleSection from "@/components/CollapsibleSection";
import GitHubPage from "@/components/GitHubPage";
import DocumentationButton from "@/components/DocumentationButton";

export default function VisionImplementation() {
  return (
    <PageTemplate
      title="Implementing Vision"
      previousPage={{ href: "/vision-options", title: "Vision Options" }}
      nextPage={{ href: "/vision-shooting", title: "Vision-Based Shooting" }}
    >
      <KeyConceptSection
        title="Integrating Vision into Robot Code"
        description="Connecting vision systems to robot code involves reading NetworkTables data, integrating AprilTag measurements into odometry, and using vision feedback for control. This section demonstrates practical vision integration patterns."
        concept="Vision data transforms autonomous accuracy and enables intelligent teleop assistance."
      />

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Reading Limelight Data
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          Limelight publishes vision data to NetworkTables. The LimelightHelpers
          library (provided by Limelight on GitHub) provides a clean API for
          reading this data without direct NetworkTables access.
        </p>

        <CollapsibleSection title="LimelightHelpers">
          <AlertBox variant="info" title="Using LimelightHelpers">
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
              LimelightHelpers is Limelight&apos;s official utility library that
              wraps NetworkTables and pose APIs. Common calls include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <strong>validPoseEstimate(...):</strong> Check if the pose
                estimate is trustworthy
              </li>
              <li>
                <strong>getBotPoseEstimate_wpiBlue(...):</strong> Get field pose
                (in WPILib (blue) frame), timestamp, tag count, and other
                information
              </li>
              <li>
                <strong>getTX()/getTY():</strong> Horizontal/vertical target
                offsets (degrees)
              </li>
              <li>
                <strong>getLatency(...):</strong> Pipeline/capture latency
                (seconds)
              </li>
            </ul>
          </AlertBox>
          <GitHubPage
            repository="Hemlock5712/Workshop-Code"
            branch="3-Limelight"
            filePath="src/main/java/frc/robot/LimelightHelpers.java"
            title="LimelightHelpers"
            description="Reference implementation for LimelightHelpers. Used by the Limelight subsystem above to retrieve pose estimates and raw vision measurements."
          />
        </CollapsibleSection>

        <AlertBox variant="warning" title="Vision Measurement Considerations">
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>Latency:</strong> Account for camera and processing delay
            </li>
            <li>
              <strong>Standard Deviation:</strong> Higher values = less trust
            </li>
            <li>
              <strong>Validation:</strong> Filter out implausible measurements
            </li>
            <li>
              <strong>Multi-Tag:</strong> Multiple tags increase accuracy
            </li>
          </ul>
        </AlertBox>

        <GitHubPage
          repository="Hemlock5712/Workshop-Code"
          branch="3-Limelight"
          filePath="src/main/java/frc/robot/subsystems/vision/Limelight.java"
          title="Limelight Code"
          description="Subsystem that pulls robot pose from LimelightHelpers, validates the estimate, models measurement noise from tag distance/count, and feeds pose+timestamp+std devs to a consumer (e.g., your drivetrain pose estimator). Caches the last valid estimate and exposes getters for logging."
        />
        <GitHubPage
          repository="Hemlock5712/Workshop-Code"
          branch="3-Limelight"
          filePath="src/main/java/frc/robot/RobotContainer.java"
          title="RobotContainer"
          description="Bindings and wiring for vision-assisted commands, showcasing how the Limelight subsystem integrates with the rest of the robot code."
        />
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Workshop Code Implementation
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          The Workshop-Code repository includes complete vision implementation
          on the <code>3-Limelight</code> branch, demonstrating Limelight
          integration with swerve drive and odometry. The code examples above
          are all taken directly from this branch, showing real working
          implementations you can reference and adapt for your own robot.
        </p>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Vision Best Practices
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-4">
              Do
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Validate vision data before using it</li>
              <li>Account for latency in measurements</li>
              <li>Use appropriate standard deviations</li>
              <li>Test vision under different lighting</li>
              <li>Log vision data for debugging</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4">
              Don&apos;t
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Trust vision measurements blindly</li>
              <li>Ignore latency compensation</li>
              <li>Use vision as only odometry source</li>
              <li>Forget to tune camera settings</li>
              <li>Skip testing in match conditions</li>
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
            href="https://docs.limelightvision.io/docs/docs-limelight/apis/complete-networktables-api"
            title="Limelight NetworkTables API"
            icon="Link"
          />
          <DocumentationButton
            href="https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html"
            title="WPILib AprilTag Guide"
            icon="Tag"
          />
          <DocumentationButton
            href="https://docs.wpilib.org/en/stable/docs/software/advanced-controls/state-space/state-space-pose-estimators.html"
            title="WPILib Pose Estimators"
            icon="Pose"
          />
          <DocumentationButton
            href="https://v6.docs.ctr-electronics.com/"
            title="Phoenix 6 Documentation"
            icon="P6"
          />
        </div>
      </section>
    </PageTemplate>
  );
}

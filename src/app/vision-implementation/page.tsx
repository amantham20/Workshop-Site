import PageTemplate from "@/components/PageTemplate";
import KeyConceptSection from "@/components/KeyConceptSection";
import AlertBox from "@/components/AlertBox";
import CodeBlock from "@/components/CodeBlock";
import CollapsibleSection from "@/components/CollapsibleSection";
import GitHubPage from "@/components/GitHubPage";
import DocumentationButton from "@/components/DocumentationButton";

export default function VisionImplementation() {
  return (
    <PageTemplate
      title="Implementing Vision"
      previousPage={{ href: "/vision-options", title: "Vision Options" }}
      nextPage={{ href: "/logging-options", title: "Logging Options" }}
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
          Limelight publishes vision data to NetworkTables. Your robot code
          reads these values to determine if targets are visible and extract
          positioning information.
        </p>

        <CodeBlock
          language="java"
          title="LimelightSubsystem.java - Basic Reading"
          code={`public class LimelightSubsystem extends SubsystemBase {
  private final NetworkTable table;

  public LimelightSubsystem() {
    table = NetworkTableInstance.getDefault().getTable("limelight");
  }

  // Check if any valid targets are detected
  public boolean hasTarget() {
    return table.getEntry("tv").getDouble(0) == 1.0;
  }

  // Get horizontal offset from crosshair to target (degrees)
  public double getTargetX() {
    return table.getEntry("tx").getDouble(0.0);
  }

  // Get vertical offset from crosshair to target (degrees)
  public double getTargetY() {
    return table.getEntry("ty").getDouble(0.0);
  }

  // Get target area (0% to 100% of image)
  public double getTargetArea() {
    return table.getEntry("ta").getDouble(0.0);
  }

  // Get AprilTag ID (if using AprilTag pipeline)
  public int getAprilTagID() {
    return (int) table.getEntry("tid").getDouble(-1);
  }

  @Override
  public void periodic() {
    // Publish telemetry
    SmartDashboard.putBoolean("Vision/HasTarget", hasTarget());
    SmartDashboard.putNumber("Vision/TargetX", getTargetX());
    SmartDashboard.putNumber("Vision/TargetY", getTargetY());
  }
}`}
        />

        <AlertBox
          variant="info"
          title="📋 Common Limelight NetworkTables Entries"
        >
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>tv:</strong> 0 = no target, 1 = target detected
            </li>
            <li>
              <strong>tx:</strong> Horizontal offset in degrees (-29.8 to 29.8)
            </li>
            <li>
              <strong>ty:</strong> Vertical offset in degrees (-24.85 to 24.85)
            </li>
            <li>
              <strong>ta:</strong> Target area percentage (0 to 100)
            </li>
            <li>
              <strong>tid:</strong> AprilTag ID detected
            </li>
            <li>
              <strong>botpose:</strong> Robot pose in field space [x, y, z,
              roll, pitch, yaw]
            </li>
          </ul>
        </AlertBox>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          AprilTag Pose Integration
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          When Limelight detects AprilTags, it can calculate the robot&apos;s
          field position. Integrate this data into your swerve drive&apos;s pose
          estimator to correct odometry drift.
        </p>

        <CollapsibleSection title="🗺️ Adding Vision Measurements to Odometry">
          <CodeBlock
            language="java"
            title="Vision Pose Integration"
            code={`public class LimelightSubsystem extends SubsystemBase {
  private final CommandSwerveDrivetrain drivetrain;

  public LimelightSubsystem(CommandSwerveDrivetrain drivetrain) {
    this.drivetrain = drivetrain;
  }

  @Override
  public void periodic() {
    // Only integrate if we see an AprilTag
    if (!hasTarget()) {
      return;
    }

    // Get robot pose from Limelight (field coordinates)
    double[] botpose = table.getEntry("botpose").getDoubleArray(new double[6]);

    if (botpose.length == 6) {
      // Extract pose components
      double x = botpose[0];
      double y = botpose[1];
      double yaw = botpose[5];  // Rotation in degrees

      // Create Pose2d from vision data
      Pose2d visionPose = new Pose2d(
        x, y,
        Rotation2d.fromDegrees(yaw)
      );

      // Get timestamp when image was captured
      double latency = table.getEntry("tl").getDouble(0)  // Pipeline latency (ms)
                     + table.getEntry("cl").getDouble(0); // Capture latency (ms)
      double timestamp = Timer.getFPGATimestamp() - (latency / 1000.0);

      // Add vision measurement to pose estimator
      // Standard deviations: trust X/Y more than rotation
      drivetrain.addVisionMeasurement(
        visionPose,
        timestamp,
        VecBuilder.fill(0.7, 0.7, 9999999)  // X, Y, Theta std devs
      );
    }
  }
}`}
          />

          <AlertBox
            variant="warning"
            title="⚠️ Vision Measurement Considerations"
          >
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                <strong>Latency:</strong> Account for camera and processing
                delay
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
        </CollapsibleSection>

        <CollapsibleSection title="🎯 Target Tracking with Vision">
          <CodeBlock
            language="java"
            title="Vision-Assisted Aiming"
            code={`public class AimAtTargetCommand extends Command {
  private final CommandSwerveDrivetrain drivetrain;
  private final LimelightSubsystem limelight;
  private final PIDController rotationController;

  public AimAtTargetCommand(
      CommandSwerveDrivetrain drivetrain,
      LimelightSubsystem limelight) {
    this.drivetrain = drivetrain;
    this.limelight = limelight;

    // PID controller to rotate robot toward target
    this.rotationController = new PIDController(0.1, 0, 0.005);
    rotationController.setTolerance(1.0);  // 1 degree tolerance

    addRequirements(drivetrain);
  }

  @Override
  public void execute() {
    if (!limelight.hasTarget()) {
      // No target - stop rotating
      drivetrain.setControl(new SwerveRequest.RobotCentric()
          .withRotationalRate(0));
      return;
    }

    // Get horizontal offset to target
    double targetX = limelight.getTargetX();

    // Calculate rotation rate to center target
    double rotationRate = rotationController.calculate(targetX, 0);

    // Apply rotation while allowing driver to translate
    drivetrain.setControl(new SwerveRequest.FieldCentric()
        .withVelocityX(driverController.getLeftY() * MAX_SPEED)
        .withVelocityY(driverController.getLeftX() * MAX_SPEED)
        .withRotationalRate(rotationRate));
  }

  @Override
  public boolean isFinished() {
    return rotationController.atSetpoint() && limelight.hasTarget();
  }
}`}
          />
        </CollapsibleSection>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Workshop Code Implementation
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          The Workshop-Code repository includes vision implementation on the{" "}
          <code>3-Limelight</code> branch, demonstrating Limelight integration
          with swerve drive and odometry.
        </p>

        <GitHubPage
          repository="Hemlock5712/Workshop-Code"
          branch="3-Limelight"
          filePath="src/main/java/frc/robot/subsystems/LimelightSubsystem.java"
          title="LimelightSubsystem.java"
          description="Complete Limelight subsystem with AprilTag pose integration and target detection."
        />
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Vision Best Practices
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-4">
              ✅ Do
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
              ❌ Don&apos;t
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
            icon="📖"
          />
          <DocumentationButton
            href="https://docs.wpilib.org/en/stable/docs/software/vision-processing/apriltag/apriltag-intro.html"
            title="WPILib AprilTag Guide"
            icon="🏷️"
          />
          <DocumentationButton
            href="https://docs.wpilib.org/en/stable/docs/software/advanced-controls/state-space/state-space-pose-estimators.html"
            title="WPILib Pose Estimators"
            icon="🗺️"
          />
          <DocumentationButton
            href="https://v6.docs.ctr-electronics.com/"
            title="Phoenix 6 Documentation"
            icon="⚡"
          />
        </div>
      </section>
    </PageTemplate>
  );
}

import PageTemplate from "@/components/PageTemplate";
import KeyConceptSection from "@/components/KeyConceptSection";
import ContentCard from "@/components/ContentCard";
import AlertBox from "@/components/AlertBox";
import CodeBlock from "@/components/CodeBlock";
import CollapsibleSection from "@/components/CollapsibleSection";
import GitHubPage from "@/components/GitHubPage";
import GithubPageWithPR from "@/components/GithubPageWithPR";
import DocumentationButton from "@/components/DocumentationButton";

export default function SwerveDriveProject() {
  return (
    <PageTemplate
      title="Creating a Swerve Drive Project"
      previousPage={{
        href: "/swerve-prerequisites",
        title: "Swerve Drive Prerequisites",
      }}
      nextPage={{ href: "/pathplanner", title: "Adding PathPlanner" }}
    >
      {/* Introduction */}
      <KeyConceptSection
        title="Using Phoenix Tuner X to Generate Swerve Code"
        description="With the swerve drive fundamentals covered, we're ready to create a complete swerve drivetrain using CTRE's Phoenix Tuner X. This powerful tool generates production-ready swerve code, handling all the complexity of kinematics, odometry, and control."
        concept="Phoenix Tuner X generates a complete, competition-ready swerve drivetrain with one configuration wizard."
      />

      <AlertBox variant="info" title="Prerequisites Complete?">
        <p className="mb-2">
          Before proceeding, make sure you&apos;ve reviewed the{" "}
          <a
            href="/swerve-prerequisites"
            className="text-primary-600 underline hover:no-underline hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            Swerve Drive Prerequisites
          </a>{" "}
          page, which covers:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-300">
          <li>Holonomic motion and swerve drive concepts</li>
          <li>Module anatomy (drive motor, azimuth motor, CANcoder)</li>
          <li>Coordinate systems (robot-centric vs field-centric)</li>
          <li>Safety practices and module zeroing</li>
        </ul>
      </AlertBox>

      {/* Section 1: Phoenix Tuner X Project Setup */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Creating a Swerve Project with Phoenix Tuner X
        </h2>

        <AlertBox variant="info" title="🚀 CTRE Swerve Project Generator">
          <p className="mb-4">
            CTRE provides a comprehensive swerve drive project generator in
            Phoenix Tuner X that creates a complete, competition-ready swerve
            drivetrain implementation. This is the recommended starting point
            for all swerve projects.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                What the Generator Creates:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li>Complete CommandSwerveDrivetrain subsystem</li>
                <li>Tuner constants for all swerve parameters</li>
                <li>Module configurations and CAN IDs</li>
                <li>Field-centric and robot-centric drive commands</li>
                <li>Simulation support for testing without hardware</li>
                <li>PathPlanner integration for autonomous</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Required Information:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li>CAN IDs for all drive motors, steer motors, encoders</li>
                <li>CANivore name (if using CANivore)</li>
                <li>Wheel diameter and gear ratios</li>
                <li>Module positions (wheelbase and trackwidth)</li>
                <li>CANcoder offset values (after zeroing)</li>
                <li>Robot mass and moment of inertia</li>
              </ul>
            </div>
          </div>
        </AlertBox>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Step-by-Step Setup Process
          </h3>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Open Phoenix Tuner X
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Launch Phoenix Tuner X and connect to your robot or CANivore.
                  Ensure all swerve motors and encoders are visible and have
                  unique CAN IDs.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Navigate to Swerve Project Generator
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Click on <strong>Swerve Project Generator</strong> in the left
                  sidebar. This will open the configuration wizard.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Configure Robot Parameters
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  Enter your robot&apos;s physical parameters:
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li>
                      <strong>Wheelbase:</strong> Front-to-back distance between
                      modules (meters)
                    </li>
                    <li>
                      <strong>Trackwidth:</strong> Side-to-side distance between
                      modules (meters)
                    </li>
                    <li>
                      <strong>Wheel Diameter:</strong> Diameter of drive wheels
                      (inches)
                    </li>
                    <li>
                      <strong>Drive Gear Ratio:</strong> Motor rotations per
                      wheel rotation
                    </li>
                    <li>
                      <strong>Steer Gear Ratio:</strong> Motor rotations per
                      module rotation
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Assign CAN IDs
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  For each module (FL, FR, BL, BR), specify:
                </p>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li>Drive motor CAN ID</li>
                    <li>Steer motor CAN ID</li>
                    <li>CANcoder CAN ID</li>
                    <li>CANcoder offset (determined during zeroing process)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Generate and Export
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Click <strong>Generate</strong> and select a location to
                  export the project. The generator will create a complete
                  WPILib project with all necessary files and configurations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DocumentationButton
          href="https://v6.docs.ctr-electronics.com/en/latest/docs/tuner/tuner-swerve/index.html"
          title="CTRE Swerve Project Generator Documentation"
          icon="📖"
        />
      </section>

      {/* Section 4: Swerve Kinematics & Control */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Swerve Kinematics &amp; Control
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          Kinematics is the mathematical relationship between the desired robot
          motion (velocities in X, Y, and rotation) and the individual wheel
          states (speed and angle) needed to achieve that motion.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <ContentCard>
            <h3 className="text-xl font-bold text-primary-900 dark:text-primary-300 mb-4">
              📐 Forward Kinematics
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Converts individual wheel states into overall robot velocity. Used
              for odometry and determining where the robot is moving.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <code className="text-xs text-slate-700 dark:text-slate-300">
                Given: [FL, FR, BL, BR] module states
                <br />
                Calculate: Robot velocity (Vx, Vy, omega)
              </code>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
              <strong>Example:</strong> If all modules point forward at the same
              speed, the robot is moving straight forward with no rotation.
            </p>
          </ContentCard>

          <ContentCard>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-4">
              📐 Inverse Kinematics
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Converts desired robot velocity into individual wheel states. Used
              for teleop driving and autonomous path following.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <code className="text-xs text-slate-700 dark:text-slate-300">
                Given: Robot velocity (Vx, Vy, omega)
                <br />
                Calculate: [FL, FR, BL, BR] module states
              </code>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
              <strong>Example:</strong> To strafe right while rotating, inverse
              kinematics calculates the unique angle and speed for each module.
            </p>
          </ContentCard>
        </div>

        <AlertBox
          variant="info"
          title="🔧 CTRE Handles Kinematics Automatically"
        >
          <p className="mb-3">
            The good news: CTRE&apos;s swerve implementation handles all
            kinematics calculations internally. You don&apos;t need to manually
            compute wheel states!
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            The <code>CommandSwerveDrivetrain</code> class uses Phoenix 6&apos;s
            built-in kinematics to convert your desired chassis speeds (Vx, Vy,
            omega) into the appropriate module states automatically.
          </p>
        </AlertBox>

        <CollapsibleSection title="🎮 Understanding Chassis Speeds">
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              Chassis speeds represent the desired velocity of the robot as a
              whole:
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
                  Vx (Forward/Back)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Linear velocity in the X direction. Positive = forward,
                  Negative = backward. Units: meters per second.
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 dark:text-green-300 mb-2">
                  Vy (Left/Right)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Linear velocity in the Y direction. Positive = left, Negative
                  = right. Units: meters per second.
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2">
                  Omega (Rotation)
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Angular velocity (rotation rate). Positive =
                  counter-clockwise, Negative = clockwise. Units: radians per
                  second.
                </p>
              </div>
            </div>

            <CodeBlock
              language="java"
              title="Creating Chassis Speeds for Control"
              code={`// Example: Drive forward at 2 m/s while rotating CCW at 1 rad/s
ChassisSpeeds speeds = new ChassisSpeeds(
    2.0,  // Vx: forward velocity (m/s)
    0.0,  // Vy: left velocity (m/s)
    1.0   // Omega: rotation rate (rad/s)
);

// For field-centric control, transform based on robot heading
ChassisSpeeds fieldRelative = ChassisSpeeds.fromFieldRelativeSpeeds(
    joystickX,     // Field X velocity
    joystickY,     // Field Y velocity
    joystickOmega, // Rotation rate
    robotHeading   // Current robot angle (Rotation2d)
);

// Apply to swerve drivetrain
drivetrain.setControl(
    new SwerveRequest.FieldCentric()
        .withVelocityX(fieldRelative.vxMetersPerSecond)
        .withVelocityY(fieldRelative.vyMetersPerSecond)
        .withRotationalRate(fieldRelative.omegaRadiansPerSecond)
);`}
            />
          </div>
        </CollapsibleSection>
      </section>

      {/* Section 5: Odometry & Pose Estimation */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Odometry &amp; Pose Estimation
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          Odometry is the process of tracking the robot&apos;s position and
          orientation on the field by integrating wheel movements over time.
          Accurate odometry is essential for autonomous navigation and
          field-aware control.
        </p>

        <div className="bg-primary-50 dark:bg-primary-950/30 rounded-lg p-8 border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            🗺️ Pose2d: Robot Position on the Field
          </h3>

          <p className="text-slate-600 dark:text-slate-300 mb-4">
            The robot&apos;s pose consists of three components:
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-2">
                X Position
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Distance along the field length (left/right from your driver
                station perspective). Units: meters.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-2">
                Y Position
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Distance along the field width (forward/backward from your
                driver station). Units: meters.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-2">
                Rotation
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Robot heading (which direction the robot is facing). Represented
                as Rotation2d. 0° = field forward.
              </p>
            </div>
          </div>

          <AlertBox variant="tip" title="💡 Field Coordinate System">
            <p>
              The field coordinate system origin (0, 0) is at the corner of the
              field from your alliance&apos;s perspective. X increases to the
              right, Y increases forward, and rotation is counter-clockwise
              positive.
            </p>
          </AlertBox>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            How Odometry Works
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <ContentCard>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                📊 Wheel Odometry
              </h4>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Primary odometry source using encoder readings from swerve
                modules.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Inputs:</strong> Module positions (distance traveled +
                  angle)
                </li>
                <li>
                  <strong>Process:</strong> Forward kinematics converts module
                  deltas to robot motion
                </li>
                <li>
                  <strong>Integration:</strong> Accumulates motion over time to
                  track pose
                </li>
                <li>
                  <strong>Accuracy:</strong> Drifts over time due to wheel slip
                  and measurement errors
                </li>
              </ul>
            </ContentCard>

            <ContentCard>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                📸 Vision Odometry
              </h4>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Secondary odometry source using camera and AprilTag vision
                targets.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Inputs:</strong> Detected AprilTags with known field
                  positions
                </li>
                <li>
                  <strong>Process:</strong> Camera calculates robot pose from
                  tag positions
                </li>
                <li>
                  <strong>Integration:</strong> Fused with wheel odometry for
                  drift correction
                </li>
                <li>
                  <strong>Accuracy:</strong> More accurate but only works when
                  tags are visible
                </li>
              </ul>
            </ContentCard>
          </div>

          <AlertBox
            variant="info"
            title="🔀 Pose Estimation with Sensor Fusion"
          >
            <p className="mb-3">
              CTRE&apos;s <code>CommandSwerveDrivetrain</code> includes built-in
              pose estimation that fuses wheel odometry with vision measurements
              using a Kalman filter approach.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              This provides more accurate position tracking than wheel odometry
              alone, automatically correcting for drift when vision targets are
              visible.
            </p>
          </AlertBox>
        </div>

        <CollapsibleSection title="📝 Odometry Code Examples">
          <div className="space-y-6">
            <CodeBlock
              language="java"
              title="Getting Current Robot Pose"
              code={`// In your subsystem or command
Pose2d currentPose = drivetrain.getState().Pose;

// Extract components
double xPosition = currentPose.getX();          // meters
double yPosition = currentPose.getY();          // meters
Rotation2d heading = currentPose.getRotation(); // robot orientation

// Display on dashboard
SmartDashboard.putNumber("Robot X", xPosition);
SmartDashboard.putNumber("Robot Y", yPosition);
SmartDashboard.putNumber("Robot Heading", heading.getDegrees());`}
            />
          </div>
        </CollapsibleSection>

        <DocumentationButton
          href="https://docs.wpilib.org/en/stable/docs/software/kinematics-and-odometry/swerve-drive-odometry.html"
          title="WPILib Swerve Drive Odometry Documentation"
          icon="📖"
        />
      </section>

      {/* Section 6: Code Implementation */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Workshop Code Implementation
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          The Workshop-Code repository contains a complete swerve drive
          implementation on the <code>1-Swerve</code> branch. This includes the
          generated swerve drivetrain, tuner constants, and drive commands.
        </p>

        <AlertBox variant="info" title="🔍 Exploring the Swerve Implementation">
          <p className="mb-3">
            The swerve code includes several key files generated by Phoenix
            Tuner X:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
            <li>
              <strong>CommandSwerveDrivetrain:</strong> Main drivetrain
              subsystem with control methods
            </li>
            <li>
              <strong>TunerConstants:</strong> All configuration values (CAN
              IDs, gear ratios, dimensions)
            </li>
            <li>
              <strong>RobotContainer:</strong> Drive command bindings and
              controller setup
            </li>
            <li>
              <strong>generated/ folder:</strong> Low-level module and drive
              train implementations
            </li>
          </ul>
        </AlertBox>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Key Files in the Implementation
          </h3>

          <p className="text-slate-600 dark:text-slate-300">
            Main swerve drivetrain subsystem with field-centric and
            robot-centric control methods, autonomous configuration, and
            simulation support.
          </p>

          <GithubPageWithPR
            repository="Hemlock5712/Workshop-Code"
            branch="1-Swerve"
            filePath="src/main/java/frc/robot/subsystems/CommandSwerveDrivetrain.java"
            pullRequestNumber={2}
            focusFile="src/main/java/frc/robot/subsystems/CommandSwerveDrivetrain.java"
          />
        </div>

        <CollapsibleSection title="🎮 Teleop Drive Command Example">
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              Controlling the swerve drive during teleop is straightforward
              using CTRE&apos;s SwerveRequest classes. The Workshop-Code
              repository demonstrates this in RobotContainer on the 1-Swerve
              branch:
            </p>

            <GitHubPage
              repository="Hemlock5712/Workshop-Code"
              branch="1-Swerve"
              filePath="src/main/java/frc/robot/RobotContainer.java"
              title="RobotContainer - Swerve Drive Setup"
              description="Complete RobotContainer with field-centric swerve drive configuration, joystick bindings, and autonomous setup."
            />
          </div>
        </CollapsibleSection>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-4">
            Swerve Implementation Complete!
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            You now have a comprehensive understanding of swerve drive concepts,
            components, and implementation. Key takeaways:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              Swerve provides holonomic motion with independent translation and
              rotation
            </li>
            <li>
              Each module has drive motor, steer motor, and absolute encoder
            </li>
            <li>
              Phoenix Tuner X generates complete, competition-ready swerve code
            </li>
            <li>Kinematics converts between robot velocity and wheel states</li>
            <li>
              Odometry tracks robot position by integrating wheel movements
            </li>
            <li>Field-centric control provides intuitive driver experience</li>
            <li>
              Swerve forms the foundation for advanced autonomous navigation
            </li>
          </ul>
        </div>

        <div className="bg-primary-50 dark:bg-primary-950/30 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            📚 Additional Resources
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://v6.docs.ctr-electronics.com/en/latest/docs/tuner/tuner-swerve/index.html"
              className="block text-primary-600 underline hover:no-underline hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              → CTRE Swerve Project Generator
            </a>
            <a
              href="https://docs.wpilib.org/en/stable/docs/software/kinematics-and-odometry/swerve-drive-kinematics.html"
              className="block text-primary-600 underline hover:no-underline hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              → WPILib Swerve Kinematics
            </a>
            <a
              href="https://v6.docs.ctr-electronics.com/en/latest/docs/api-reference/index.html"
              className="block text-primary-600 underline hover:no-underline hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              → Phoenix 6 API Reference
            </a>
            <a
              href="https://pathplanner.dev/"
              className="block text-primary-600 underline hover:no-underline hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              → PathPlanner Documentation
            </a>
          </div>
        </div>
      </section>
    </PageTemplate>
  );
}

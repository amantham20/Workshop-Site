import PageTemplate from "@/components/PageTemplate";
import KeyConceptSection from "@/components/KeyConceptSection";
import AlertBox from "@/components/AlertBox";
import CodeBlock from "@/components/CodeBlock";
import CollapsibleSection from "@/components/CollapsibleSection";
import GitHubPage from "@/components/GitHubPage";
import DocumentationButton from "@/components/DocumentationButton";

export default function LoggingImplementation() {
  return (
    <PageTemplate
      title="Implementing Logging"
      previousPage={{ href: "/logging-options", title: "Logging Options" }}
      nextPage={{ href: "/vision-options", title: "Vision Options" }}
    >
      {/* Introduction */}
      <KeyConceptSection
        title="Setting Up Data Logging"
        description="Implementing logging in your robot code is straightforward with WPILib's DataLogManager. This section shows you how to enable logging, publish data to NetworkTables, and view logs with AdvantageScope."
        concept="A few lines of code unlock comprehensive data logging for debugging and analysis."
      />

      {/* Quick Setup */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Quick Setup: Enable DataLogManager
        </h2>

        <AlertBox variant="info" title="🚀 One-Line Setup">
          <p className="mb-3">
            DataLogManager can be enabled with a single line in your Robot.java
            file. Once enabled, it automatically logs all NetworkTables data to
            a .wpilog file on the roboRIO.
          </p>
        </AlertBox>

        <CodeBlock
          language="java"
          title="Robot.java - Enable Logging"
          code={`public class Robot extends TimedRobot {
  @Override
  public void robotInit() {
    // Enable data logging - stores logs in /home/lvuser/logs/
    DataLogManager.start();

    // Optional: Also log Driver Station data (joystick inputs, enabled state)
    DriverStation.startDataLog(DataLogManager.getLog());

    // Optional: Log console output to the data log
    DataLogManager.logNetworkTables(false);  // false = don't log NT to console
  }

  // Rest of your robot code...
}`}
        />

        <AlertBox variant="success" title="✅ That's It!">
          <p>
            With these three lines, your robot is now logging all NetworkTables
            data, joystick inputs, and robot state to persistent log files.
          </p>
        </AlertBox>

        <CollapsibleSection title="🆕 Alternative: Using WPILib Epilogue (Java Only)">
          <div className="space-y-4">
            <p className="text-slate-600 dark:text-slate-300">
              WPILib 2025+ includes Epilogue, an annotation-based logging
              framework that automatically generates logging code at compile
              time. Instead of manually publishing data to NetworkTables, you
              can simply annotate your classes with @Logged.
            </p>

            <CodeBlock
              language="java"
              title="Robot.java - Enable Epilogue Logging"
              code={`import edu.wpi.first.epilogue.Epilogue;
import edu.wpi.first.epilogue.Logged;

public class Robot extends TimedRobot {
  @Override
  public void robotInit() {
    // Configure Epilogue with desired settings
    Epilogue.configure(config -> {
      config.dataLogger = new DataLogger(DataLogManager.getLog());
      config.errorHandler = (message, throwable) -> {
        DriverStation.reportError(message, throwable.getStackTrace());
      };
      config.minimumImportance = Logged.Importance.DEBUG;
    });

    // Bind Epilogue to the robot's periodic cycle
    // This runs logging offset from the main loop for better performance
    Epilogue.bind(this);
  }

  // Rest of your robot code...
}`}
            />

            <CodeBlock
              language="java"
              title="Subsystem with @Logged Annotation"
              code={`import edu.wpi.first.epilogue.Logged;
import edu.wpi.first.epilogue.NotLogged;

@Logged  // This annotation automatically logs all public fields and methods
public class ArmSubsystem extends SubsystemBase {
  private final TalonFX motor;
  private final PositionVoltage positionRequest = new PositionVoltage(0);

  // Logged automatically: position, velocity, current, voltage, temperature
  public double getPosition() {
    return motor.getPosition().getValueAsDouble();
  }

  public double getVelocity() {
    return motor.getVelocity().getValueAsDouble();
  }

  public double getCurrent() {
    return motor.getSupplyCurrent().getValueAsDouble();
  }

  public double getTargetPosition() {
    return positionRequest.Position;
  }

  // Use @NotLogged to exclude specific fields/methods from logging
  @NotLogged
  private void internalHelperMethod() {
    // This won't be logged
  }

  // No periodic() method needed for logging!
  // Epilogue automatically logs all public getters at 50Hz
}`}
            />

            <AlertBox variant="tip" title="💡 Epilogue Benefits">
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Zero boilerplate:</strong> No SmartDashboard.put()
                  calls in periodic()
                </li>
                <li>
                  <strong>Compile-time generation:</strong> Efficient code with
                  no runtime overhead
                </li>
                <li>
                  <strong>Automatic discovery:</strong> Logs all public
                  fields/getters unless marked @NotLogged
                </li>
                <li>
                  <strong>Performance tracking:</strong> Logs time spent logging
                  to NetworkTables
                </li>
                <li>
                  <strong>Full AdvantageScope integration:</strong> Works
                  seamlessly with log visualization
                </li>
              </ul>
            </AlertBox>

            <DocumentationButton
              href="https://docs.wpilib.org/en/stable/docs/software/telemetry/robot-telemetry-with-annotations.html"
              title="WPILib Epilogue Documentation"
              icon="📖"
            />
          </div>
        </CollapsibleSection>
      </section>

      {/* Publishing Data */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Publishing Data to NetworkTables
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          To log data from your subsystems, publish it to NetworkTables using
          SmartDashboard or NetworkTableInstance. DataLogManager will
          automatically capture it.
        </p>

        <CollapsibleSection title="📊 Subsystem Telemetry Example">
          <CodeBlock
            language="java"
            title="Subsystem with Telemetry"
            code={`public class ArmSubsystem extends SubsystemBase {
  private final TalonFX motor;
  private final PositionVoltage positionRequest = new PositionVoltage(0);

  public ArmSubsystem() {
    motor = new TalonFX(1, "canivore");
    // Configure motor...
  }

  @Override
  public void periodic() {
    // Publish motor telemetry to NetworkTables
    // DataLogManager will automatically log these values

    SmartDashboard.putNumber("Arm/Position", motor.getPosition().getValueAsDouble());
    SmartDashboard.putNumber("Arm/Velocity", motor.getVelocity().getValueAsDouble());
    SmartDashboard.putNumber("Arm/Current", motor.getSupplyCurrent().getValueAsDouble());
    SmartDashboard.putNumber("Arm/Voltage", motor.getMotorVoltage().getValueAsDouble());
    SmartDashboard.putNumber("Arm/Temperature", motor.getDeviceTemp().getValueAsDouble());

    // Log target vs actual for PID analysis
    SmartDashboard.putNumber("Arm/TargetPosition", positionRequest.Position);
    SmartDashboard.putNumber("Arm/Error",
        positionRequest.Position - motor.getPosition().getValueAsDouble());
  }

  public void setTargetPosition(double rotations) {
    motor.setControl(positionRequest.withPosition(rotations));
  }
}`}
          />
        </CollapsibleSection>

        <CollapsibleSection title="🗺️ Logging Robot Pose">
          <CodeBlock
            language="java"
            title="Swerve Drive Odometry Logging"
            code={`public class CommandSwerveDrivetrain extends SubsystemBase {

  @Override
  public void periodic() {
    // Get current robot pose
    Pose2d pose = getState().Pose;

    // Log pose components
    SmartDashboard.putNumber("Odometry/X", pose.getX());
    SmartDashboard.putNumber("Odometry/Y", pose.getY());
    SmartDashboard.putNumber("Odometry/Heading", pose.getRotation().getDegrees());

    // Log as array for AdvantageScope field visualization
    SmartDashboard.putNumberArray("Odometry/Pose", new double[] {
      pose.getX(),
      pose.getY(),
      pose.getRotation().getRadians()
    });

    // Log module states for detailed analysis
    SwerveModuleState[] states = getModuleStates();
    for (int i = 0; i < states.length; i++) {
      SmartDashboard.putNumber("Swerve/Module" + i + "/Angle",
          states[i].angle.getDegrees());
      SmartDashboard.putNumber("Swerve/Module" + i + "/Speed",
          states[i].speedMetersPerSecond);
    }
  }
}`}
          />
        </CollapsibleSection>

        <CollapsibleSection title="🎮 Logging Command State">
          <CodeBlock
            language="java"
            title="Command Scheduler Logging"
            code={`public class Robot extends TimedRobot {

  @Override
  public void robotPeriodic() {
    // WPILib automatically logs command scheduler state
    CommandScheduler.getInstance().run();

    // Optional: Log active commands explicitly
    var runningCommands = CommandScheduler.getInstance().requiring(subsystem);
    SmartDashboard.putString("Commands/Active",
        runningCommands.toString());
  }
}`}
          />
        </CollapsibleSection>

        <AlertBox variant="warning" title="⚠️ Performance Considerations">
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>Don&apos;t overdo it:</strong> Logging too much data can
              impact loop timing
            </li>
            <li>
              <strong>Use appropriate keys:</strong> Organize data with
              hierarchical keys (e.g., &quot;Subsystem/Parameter&quot;)
            </li>
            <li>
              <strong>Avoid String spam:</strong> Strings are expensive to log
              at high frequency
            </li>
            <li>
              <strong>Consider sampling rate:</strong> Not all data needs 50Hz
              logging
            </li>
          </ul>
        </AlertBox>
      </section>

      {/* Workshop Implementation */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Workshop Code Implementation
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          The Workshop-Code repository includes logging implementation on the{" "}
          <code>2-Logging</code> branch, demonstrating DataLogManager setup and
          comprehensive telemetry publishing.
        </p>

        <GitHubPage
          repository="Hemlock5712/Workshop-Code"
          branch="2-Logging"
          filePath="src/main/java/frc/robot/Robot.java"
          title="Robot.java with Logging"
          description="Main robot class with DataLogManager initialization and logging configuration."
        />
      </section>

      {/* Viewing Logs */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Viewing Logs with AdvantageScope
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          AdvantageScope is a powerful log visualization tool that reads .wpilog
          files and displays data with time-synchronized graphs, 3D field views,
          and more.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              📥 Getting Log Files
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Connect to roboRIO via USB or WiFi</li>
              <li>Open web browser to roborio-TEAM-frc.local</li>
              <li>Navigate to the /logs/ directory</li>
              <li>Download .wpilog files from recent matches</li>
              <li>Logs are named with timestamps for easy identification</li>
            </ol>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              📊 Visualizing in AdvantageScope
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Download and install AdvantageScope</li>
              <li>Open your .wpilog file</li>
              <li>Add line graphs for numeric data</li>
              <li>Use 3D field view for odometry visualization</li>
              <li>Scrub timeline to analyze specific moments</li>
            </ol>
          </div>
        </div>

        <AlertBox variant="tip" title="💡 AdvantageScope Pro Tips">
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>Overlay multiple signals:</strong> Compare target vs
              actual values on same graph
            </li>
            <li>
              <strong>Export data:</strong> Export CSV for external analysis in
              Excel or Python
            </li>
            <li>
              <strong>Video sync:</strong> Sync log data with match video for
              context
            </li>
            <li>
              <strong>Save layouts:</strong> Create reusable dashboard layouts
              for quick analysis
            </li>
          </ul>
        </AlertBox>

        <DocumentationButton
          href="https://github.com/Mechanical-Advantage/AdvantageScope/blob/main/docs/INDEX.md"
          title="AdvantageScope Documentation"
          icon="📖"
        />
      </section>

      {/* Best Practices */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Logging Best Practices
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-4">
              ✅ Do
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Log sensor inputs and motor outputs</li>
              <li>Use hierarchical key naming (Subsystem/Parameter)</li>
              <li>Log target setpoints alongside actual values</li>
              <li>Include timestamps for event logging</li>
              <li>Download logs after every match</li>
              <li>Review logs between matches to catch issues</li>
            </ul>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4">
              ❌ Don&apos;t
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Log high-frequency strings (use numbers/booleans)</li>
              <li>Publish the same data multiple times</li>
              <li>Ignore loop overrun warnings from excessive logging</li>
              <li>Forget to download logs before they&apos;re overwritten</li>
              <li>Log sensitive information (team strategies, etc.)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Additional Resources
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <DocumentationButton
            href="https://docs.wpilib.org/en/stable/docs/software/telemetry/datalog.html"
            title="WPILib DataLogManager Documentation"
            icon="📖"
          />
          <DocumentationButton
            href="https://github.com/Mechanical-Advantage/AdvantageScope"
            title="AdvantageScope GitHub"
            icon="🔧"
          />
          <DocumentationButton
            href="https://docs.wpilib.org/en/stable/docs/software/dashboards/smartdashboard/index.html"
            title="SmartDashboard Documentation"
            icon="📊"
          />
          <DocumentationButton
            href="https://docs.wpilib.org/en/stable/docs/software/networktables/index.html"
            title="NetworkTables Documentation"
            icon="🌐"
          />
        </div>
      </section>
    </PageTemplate>
  );
}

import PageTemplate from "@/components/PageTemplate";
import KeyConceptSection from "@/components/KeyConceptSection";
import AlertBox from "@/components/AlertBox";
import CodeBlock from "@/components/CodeBlock";
import CollapsibleSection from "@/components/CollapsibleSection";
import GithubPageWithPR from "@/components/GithubPageWithPR";
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

      {/* Epilogue Basics */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Using WPILib Epilogue
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          WPILib 2025+ includes Epilogue, an annotation-based logging framework
          that automatically generates logging code at compile time. Instead of
          manually publishing data to NetworkTables, you simply annotate your
          classes with @Logged.
        </p>

        <CodeBlock
          language="java"
          title="Subsystem with @Logged Annotation"
          code={`import edu.wpi.first.epilogue.Logged;

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

  // No periodic() method needed for logging!
  // Epilogue automatically logs all public getters at 50Hz
}`}
        />

        <AlertBox variant="tip" title="💡 Epilogue Benefits">
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>Zero boilerplate:</strong> No SmartDashboard.put() calls
              in periodic()
            </li>
            <li>
              <strong>Compile-time generation:</strong> Efficient code with no
              runtime overhead
            </li>
            <li>
              <strong>Automatic discovery:</strong> Logs all public
              fields/getters unless marked @NotLogged
            </li>
            <li>
              <strong>Built into WPILib 2025:</strong> No extra dependencies
              required
            </li>
          </ul>
        </AlertBox>

        <DocumentationButton
          href="https://docs.wpilib.org/en/stable/docs/software/telemetry/robot-telemetry-with-annotations.html"
          title="WPILib Epilogue Documentation"
        />
      </section>

      {/* DataLogManager Examples */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          DataLogManager Examples
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
          For this Workshop we will DataLogManager and Epilogue setup as they
          work perfect together and are built into WPILib.
        </p>

        <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Robot.java - Adding Logging
        </h3>

        <GithubPageWithPR
          repository="Hemlock5712/Workshop-Code"
          branch="2-Logging"
          filePath="src/main/java/frc/robot/Robot.java"
          pullRequestNumber={8}
          focusFile="Robot.java"
        />

        <CollapsibleSection title="📦 RobotContainer.java Changes">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            RobotContainer.java includes logging setup for subsystems and
            commands. This helps track which commands are running and monitor
            subsystem state.
          </p>
          <GithubPageWithPR
            repository="Hemlock5712/Workshop-Code"
            branch="2-Logging"
            filePath="src/main/java/frc/robot/RobotContainer.java"
            pullRequestNumber={8}
            focusFile="RobotContainer.java"
          />
        </CollapsibleSection>

        <CollapsibleSection title="🔧 Subsystem Logging Example">
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Subsystems use Epilogue&apos;s @Logged annotation to automatically
            log data. This example shows the CommandSwerveDrivetrain with
            Epilogue logging enabled.
          </p>
          <GithubPageWithPR
            repository="Hemlock5712/Workshop-Code"
            branch="2-Logging"
            filePath="src/main/java/frc/robot/subsystems/CommandSwerveDrivetrain.java"
            pullRequestNumber={8}
            focusFile="CommandSwerveDrivetrain.java"
          />
        </CollapsibleSection>
      </section>

      {/* Viewing Logs */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          AdvantageScope
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          AdvantageScope is a powerful log visualization tool that can both read
          .wpilog files for post-match analysis and connect to your robot in
          real-time for live data monitoring.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              📡 Real-Time Data Viewing
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              AdvantageScope can connect to your robot while it&apos;s running
              to view live data through NetworkTables.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Open AdvantageScope on your driver station</li>
              <li>Select &quot;Connect to Robot&quot; from the menu</li>
              <li>
                Enter your team number or robot IP address (e.g.,
                roborio-TEAM-frc.local)
              </li>
              <li>AdvantageScope connects via NetworkTables</li>
              <li>
                Add graphs and visualizations to monitor data in real-time
              </li>
              <li>Perfect for tuning PID controllers and debugging sensors</li>
            </ol>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              📥 Post-Match Log Analysis
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              Download and analyze .wpilog files after matches for detailed
              performance review.
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Connect to roboRIO via USB or WiFi</li>
              <li>Open web browser to roborio-TEAM-frc.local</li>
              <li>Navigate to the /logs/ directory</li>
              <li>Download .wpilog files from recent matches</li>
              <li>Open the log file in AdvantageScope</li>
              <li>Add line graphs for numeric data</li>
              <li>Use 3D field view for odometry visualization</li>
              <li>Scrub timeline to analyze specific moments</li>
            </ol>
          </div>
        </div>

        <AlertBox variant="info" title="💡 NetworkTables Connection">
          <p className="mb-3">
            When connecting to your robot in real-time, AdvantageScope uses
            NetworkTables to subscribe to the data being published by your robot
            code. This means:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              You can see live sensor values and motor outputs as your robot
              runs
            </li>
            <li>
              Changes to PID gains or other parameters can be tested immediately
            </li>
            <li>
              No need to wait for match completion to download and analyze logs
            </li>
            <li>
              Real-time data is <strong>not</strong> automatically saved unless
              DataLogManager is enabled
            </li>
          </ul>
        </AlertBox>

        <AlertBox variant="tip" title="💡 AdvantageScope Pro Tips">
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <strong>Overlay multiple signals:</strong> Compare target vs
              actual values on same graph
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

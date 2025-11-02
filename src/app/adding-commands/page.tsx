import MechanismTabs from "@/components/MechanismTabs";
import PageTemplate from "@/components/PageTemplate";
import ConceptBox from "@/components/ConceptBox";
import CodeBlock from "@/components/CodeBlock";
import KeyConceptSection from "@/components/KeyConceptSection";
import Quiz from "@/components/Quiz";

export default function AddingCommands() {
  return (
    <PageTemplate
      title="Commands"
      previousPage={{ href: "/building-subsystems", title: "Subsystems" }}
      nextPage={{ href: "/triggers", title: "Triggers" }}
    >
      {/* Introduction */}
      <KeyConceptSection
        title="Commands - Coordinating Robot Actions"
        description="Commands are the actions that your robot performs. They use subsystems to accomplish tasks and can be triggered by user input, sensors, or automated sequences."
        concept="Commands tell subsystems what action to run."
      />

      {/* Command Examples */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Command Structure & Examples
        </h2>

        {/* Inline Command Examples */}
        <details className="card p-6">
          <summary className="text-xl font-bold text-primary-600 mb-4 cursor-pointer hover:text-primary-700 dark:hover:text-primary-300">
            🎮 Inline Command Methods Example
          </summary>
          <div className="mt-4">
            <CodeBlock
              language="java"
              title="Subsystem Command Methods"
              code={`// In your Arm subsystem - add these command methods:

public Command moveUp() {
    return runOnce(() -> setVoltage(6));
}

public Command moveDown() {
    return runOnce(() -> setVoltage(-6));
}

public Command stopArm() {
    return runOnce(() -> stop());
}

`}
            />
          </div>
        </details>

        {/* Key Concepts */}
        <div className="grid md:grid-cols-3 gap-6">
          <ConceptBox
            title="⚡ Command Methods"
            code={<code>return runOnce(() -&gt; action);</code>}
          >
            Create commands using factory methods like runOnce() to execute
            actions once when the command is triggered.
          </ConceptBox>

          <ConceptBox
            title="🔗 Command Requirements"
            code={<code>addRequirements(subsystem);</code>}
          >
            Commands must declare which subsystems they use to prevent conflicts
            and ensure proper scheduling.
          </ConceptBox>

          <ConceptBox
            title="🔄 Command Lifecycle"
            code={<code>initialize() → execute() → end()</code>}
          >
            Commands have a clear lifecycle: start, run continuously, then clean
            up when finished.
          </ConceptBox>
        </div>
      </section>

      {/* Mechanism Implementation Tabs */}
      <MechanismTabs
        sectionTitle="Workshop Implementation"
        armContent={{
          beforeItems: [
            "• Arm subsystem with basic voltage control",
            "• No user input integration",
            "• No commands to coordinate actions",
            "• Manual method calls only",
          ],
          afterItems: [
            "• Enhanced Arm subsystem methods",
            "• Commands for moveUp(), moveDown()",
            "• Ready for user input integration",
          ],
          repository: "Hemlock5712/Workshop-Code",
          filePath: "src/main/java/frc/robot/subsystems/Arm.java",
          branch: "2-Commands",
          pullRequestNumber: 2,
          focusFile: "Arm.java",
          walkthrough: {
            leftTitle: "New Subsystem Methods",
            leftItems: [
              "• <strong>moveUp():</strong> Positive voltage for upward movement",
              "• <strong>moveDown():</strong> Negative voltage for downward movement",
            ],
            rightTitle: "Command Benefits",
            rightItems: [
              "• <strong>Encapsulation:</strong> Actions wrapped in reusable commands",
              "• <strong>Safety:</strong> Automatic stop when command ends",
              "• <strong>Flexibility:</strong> Ready for trigger integration",
            ],
          },
          nextStepText:
            "Enhanced Arm subsystem with command methods! Next, we'll learn about Triggers to bind user input before verifying mechanism setup.",
        }}
        flywheelContent={{
          beforeItems: [
            "• Flywheel subsystem with basic voltage control",
            "• No user input integration",
            "• No commands to coordinate actions",
            "• Manual method calls only",
          ],
          afterItems: [
            "• Enhanced Flywheel subsystem methods",
            "• Commands for runSlow(), runFast()",
            "• Ready for user input integration",
          ],
          repository: "Hemlock5712/Workshop-Code",
          filePath: "src/main/java/frc/robot/subsystems/Flywheel.java",
          branch: "2-Commands",
          pullRequestNumber: 2,
          focusFile: "Flywheel.java",
          walkthrough: {
            leftTitle: "New Subsystem Methods",
            leftItems: [
              "• <strong>runSlow():</strong> Low voltage (3V) for testing",
              "• <strong>runFast():</strong> High voltage (6V) for shooting",
            ],
            rightTitle: "Command Benefits",
            rightItems: [
              "• <strong>Encapsulation:</strong> Actions wrapped in reusable commands",
              "• <strong>Safety:</strong> Automatic stop when command ends",
              "• <strong>Flexibility:</strong> Ready for trigger integration",
            ],
          },
          nextStepText:
            "Enhanced Flywheel subsystem with command methods! Next, we'll learn about Triggers to bind user input before verifying mechanism setup.",
        }}
      />

      {/* Quiz Section */}
      <section className="flex flex-col gap-8">
        <Quiz
          title="📝 Knowledge Check"
          questions={[
            {
              id: 1,
              question:
                "What is the primary purpose of commands in command-based programming?",
              options: [
                "To configure motor hardware settings",
                "To coordinate robot actions using subsystems",
                "To read sensor data",
                "To manage network communications",
              ],
              correctAnswer: 1,
              explanation:
                "Commands are the actions that your robot performs. They use subsystems to accomplish tasks and can be triggered by user input, sensors, or automated sequences.",
            },
            {
              id: 2,
              question: "What does the runOnce() factory method do?",
              options: [
                "Runs a command continuously until stopped",
                "Executes an action once when the command is triggered",
                "Schedules a command to run at a specific time",
                "Repeats a command exactly once per second",
              ],
              correctAnswer: 1,
              explanation:
                "The runOnce() factory method creates a command that executes the specified action once when triggered, then immediately finishes.",
            },
            {
              id: 3,
              question:
                "Why must commands declare which subsystems they use with addRequirements()?",
              options: [
                "To improve code performance",
                "To prevent conflicts and ensure proper scheduling",
                "To enable telemetry logging",
                "To configure motor parameters",
              ],
              correctAnswer: 1,
              explanation:
                "Commands must declare their subsystem requirements to prevent conflicts (two commands trying to control the same subsystem) and ensure the command scheduler properly manages command execution.",
            },
            {
              id: 4,
              question: "What is the correct order of the command lifecycle?",
              options: [
                "execute() → initialize() → end()",
                "end() → initialize() → execute()",
                "initialize() → execute() → end()",
                "initialize() → end() → execute()",
              ],
              correctAnswer: 2,
              explanation:
                "Commands follow the lifecycle: initialize() (called once at start) → execute() (called repeatedly) → end() (called once when finished). This provides clear start, run, and cleanup phases.",
            },
          ]}
        />
      </section>
    </PageTemplate>
  );
}

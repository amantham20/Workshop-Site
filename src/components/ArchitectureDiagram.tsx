"use client";

interface ArchitectureDiagramProps {
  variant?: "simple" | "detailed";
}

export default function ArchitectureDiagram({
  variant = "simple",
}: ArchitectureDiagramProps) {
  if (variant === "simple") {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
          🗺️ How Command-Based Programming Works
        </h3>

        {/* Simple Flow Diagram */}
        <div className="flex flex-col gap-4">
          {/* Row 1: Input */}
          <div className="flex items-center justify-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4 text-center max-w-xs">
              <div className="text-2xl mb-2">🎮</div>
              <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">
                Triggers
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Controller buttons, sensors, or custom conditions
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-500 mt-2 italic">
                &quot;When button A is pressed...&quot;
              </p>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>

          {/* Row 2: Commands */}
          <div className="flex items-center justify-center">
            <div className="bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-lg p-4 text-center max-w-xs">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-bold text-green-900 dark:text-green-300 mb-1">
                Commands
              </h4>
              <p className="text-sm text-green-800 dark:text-green-400">
                Actions the robot performs
              </p>
              <p className="text-xs text-green-700 dark:text-green-500 mt-2 italic">
                &quot;...run the &apos;Raise Arm&apos; command&quot;
              </p>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>

          {/* Row 3: Subsystems */}
          <div className="flex items-center justify-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4 text-center max-w-xs">
              <div className="text-2xl mb-2">🦾</div>
              <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-1">
                Subsystems
              </h4>
              <p className="text-sm text-purple-800 dark:text-purple-400">
                Robot mechanisms (arm, shooter, etc.)
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-500 mt-2 italic">
                &quot;...which controls the Arm subsystem&apos;s motors&quot;
              </p>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>

          {/* Row 4: Hardware */}
          <div className="flex items-center justify-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-500 rounded-lg p-4 text-center max-w-xs">
              <div className="text-2xl mb-2">⚙️</div>
              <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-1">
                Motors & Sensors
              </h4>
              <p className="text-sm text-orange-800 dark:text-orange-400">
                Physical robot hardware
              </p>
              <p className="text-xs text-orange-700 dark:text-orange-500 mt-2 italic">
                &quot;...to physically move the arm up&quot;
              </p>
            </div>
          </div>

          {/* Feedback Arrow */}
          <div className="flex items-center justify-center mt-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-dashed border-slate-400 dark:border-slate-600 max-w-xs text-center">
              <svg
                className="w-6 h-6 text-slate-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Sensors provide feedback:</strong> Position, velocity,
                and status information flows back up to help Commands make
                decisions
              </p>
            </div>
          </div>
        </div>

        {/* Real Example */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border-l-4 border-blue-500">
          <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">
            📖 Real Example: Raising an Arm
          </h4>
          <div className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
            <p>
              1. <strong>Trigger:</strong> Driver presses button A
            </p>
            <p>
              2. <strong>Command:</strong> &quot;RaiseArm&quot; command starts
              running
            </p>
            <p>
              3. <strong>Subsystem:</strong> Arm subsystem receives target
              position
            </p>
            <p>
              4. <strong>Hardware:</strong> Motor spins, encoder measures
              position
            </p>
            <p>
              5. <strong>Feedback:</strong> Encoder reports &quot;target
              reached!&quot; → Command ends
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Detailed variant with more technical information
  return (
    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
        🗺️ Command-Based Architecture (Detailed)
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Column 1: Triggers */}
        <div className="flex flex-col gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4">
            <div className="text-2xl mb-2 text-center">🎮</div>
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 text-center">
              Triggers
            </h4>
            <div className="text-xs text-blue-800 dark:text-blue-400 space-y-2">
              <div className="bg-white dark:bg-slate-800 p-2 rounded">
                <strong>Button Triggers:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  controller.a().onTrue()
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded">
                <strong>Sensor Triggers:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  new Trigger(() → sensor.get())
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded">
                <strong>State Triggers:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Based on robot state
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Commands */}
        <div className="flex flex-col gap-4">
          <div className="bg-green-100 dark:bg-green-900/30 border-2 border-green-500 rounded-lg p-4">
            <div className="text-2xl mb-2 text-center">⚡</div>
            <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 text-center">
              Commands
            </h4>
            <div className="text-xs text-green-800 dark:text-green-400 space-y-2">
              <div className="bg-white dark:bg-slate-800 p-2 rounded">
                <strong>Lifecycle:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  initialize() → execute() → isFinished() → end()
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded">
                <strong>Requirements:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Declares needed subsystems
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded">
                <strong>Scheduling:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Command scheduler manages execution
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Subsystems */}
        <div className="flex flex-col gap-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 rounded-lg p-4">
            <div className="text-2xl mb-2 text-center">🦾</div>
            <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2 text-center">
              Subsystems
            </h4>
            <div className="text-xs text-purple-800 dark:text-purple-400 space-y-2">
              <div className="bg-white dark:bg-slate-800 p-2 rounded">
                <strong>Hardware:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Motors, sensors, pneumatics
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded">
                <strong>State:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Current position, velocity, etc.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-2 rounded">
                <strong>Methods:</strong>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Control and query functions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow */}
      <div className="mt-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-3 text-center">
          🔄 Information Flow
        </h4>
        <div className="flex items-center justify-between text-xs">
          <div className="text-center">
            <p className="font-bold text-blue-600 dark:text-blue-400">
              User Input
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Controller/Sensors
            </p>
          </div>
          <span className="text-2xl text-slate-400">→</span>
          <div className="text-center">
            <p className="font-bold text-green-600 dark:text-green-400">
              Commands
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Coordinate Actions
            </p>
          </div>
          <span className="text-2xl text-slate-400">→</span>
          <div className="text-center">
            <p className="font-bold text-purple-600 dark:text-purple-400">
              Subsystems
            </p>
            <p className="text-slate-600 dark:text-slate-400">
              Control Hardware
            </p>
          </div>
          <span className="text-2xl text-slate-400">→</span>
          <div className="text-center">
            <p className="font-bold text-orange-600 dark:text-orange-400">
              Physical Action
            </p>
            <p className="text-slate-600 dark:text-slate-400">Robot Moves</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3 border-l-4 border-green-500">
          <h5 className="font-bold text-green-900 dark:text-green-300 mb-2 text-sm">
            ✅ Benefits
          </h5>
          <ul className="text-xs text-green-800 dark:text-green-400 space-y-1">
            <li>• Clear separation of concerns</li>
            <li>• Easy to test individual pieces</li>
            <li>• Prevents conflicting commands</li>
            <li>• Organized, maintainable code</li>
          </ul>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border-l-4 border-blue-500">
          <h5 className="font-bold text-blue-900 dark:text-blue-300 mb-2 text-sm">
            💡 Key Principle
          </h5>
          <p className="text-xs text-blue-800 dark:text-blue-400">
            Each piece has one job: Triggers detect input, Commands coordinate
            actions, Subsystems control hardware. This separation makes complex
            robots manageable!
          </p>
        </div>
      </div>
    </div>
  );
}

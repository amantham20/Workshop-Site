import PageTemplate from "@/components/PageTemplate";
import KeyConceptSection from "@/components/KeyConceptSection";
import ContentCard from "@/components/ContentCard";
import ConceptBox from "@/components/ConceptBox";
import AlertBox from "@/components/AlertBox";

export default function SwervePrerequisites() {
  return (
    <PageTemplate
      title="Swerve Drive Prerequisites"
      previousPage={{ href: "/motion-magic", title: "Motion Magic" }}
      nextPage={{
        href: "/swerve-drive-project",
        title: "Creating a Swerve Drive Project",
      }}
    >
      {/* Introduction */}
      <KeyConceptSection
        title="Understanding Swerve Drive Fundamentals"
        description="Before diving into swerve drive implementation, it's essential to understand the core concepts, hardware components, and control systems that make swerve drive possible. This foundation will prepare you for successfully creating and tuning your swerve drivetrain."
        concept="Master the fundamentals of swerve drive: holonomic motion, coordinate systems, module anatomy, and field-centric control."
      />

      {/* Section 1: Key Concepts */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Understanding Swerve Drive Concepts
        </h2>

        <div className="bg-primary-50 dark:bg-primary-950/30 rounded-lg p-8 border border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            What Makes Swerve Drive Special?
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-primary-600 dark:text-primary-400 mb-3 text-lg">
                Holonomic Motion
              </h4>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                Unlike tank drive or mecanum, swerve drive allows independent
                control of translation (movement direction) and rotation
                (heading).
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  Move in any direction without changing robot orientation
                </li>
                <li>Strafe sideways while facing a target</li>
                <li>Rotate while moving in any direction</li>
                <li>Maximum field maneuverability and control</li>
              </ul>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-green-600 dark:text-green-400 mb-3 text-lg">
                Independent Modules
              </h4>
              <p className="text-slate-600 dark:text-slate-300 mb-3">
                Each wheel module has its own drive motor and azimuth (steering)
                motor, giving complete control over wheel direction and speed.
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>Four independent swerve modules</li>
                <li>Each module: drive motor + steering motor + encoder</li>
                <li>Coordinated control for complex movements</li>
                <li>Optimal traction and pushing power</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ConceptBox title="Field-Centric Control">
            Drive relative to the field, not the robot. Push forward on the
            joystick and the robot moves away from your driver station,
            regardless of robot orientation.
          </ConceptBox>
          <ConceptBox title="Robot-Centric Control">
            Drive relative to the robot&apos;s orientation. Forward is always
            the front of the robot, useful for precise maneuvering and driver
            preference.
          </ConceptBox>
          <ConceptBox title="Autonomous Foundation">
            Swerve provides the mobility needed for complex autonomous routines,
            path following, and precise positioning on the field.
          </ConceptBox>
        </div>

        <AlertBox variant="info" title="Why Swerve for This Workshop?">
          <p className="mb-3">
            After mastering single-mechanism control (arms, flywheels), swerve
            drive is the logical next step. It introduces:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
            <li>
              <strong>Coordinate Systems:</strong> Understanding field vs robot
              reference frames
            </li>
            <li>
              <strong>Kinematics:</strong> Converting desired robot motion to
              individual wheel states
            </li>
            <li>
              <strong>Odometry:</strong> Tracking robot position on the field
            </li>
            <li>
              <strong>Path Following:</strong> Foundation for autonomous
              navigation
            </li>
          </ul>
        </AlertBox>
      </section>

      {/* Section 2: Swerve Module Anatomy */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Swerve Module Anatomy
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          Each swerve module consists of three key components that work together
          to provide independent wheel control:
        </p>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
          <ContentCard>
            <div className="bg-primary-100 dark:bg-primary-900/20 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-primary-900 dark:text-primary-300">
                Drive Motor
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Controls the wheel speed and provides forward/backward motion for
              the module. Typically a high-power motor like Kraken X60 or Falcon
              500.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <strong>Purpose:</strong> Translational velocity control
                <br />
                <strong>Control:</strong> Velocity PID or voltage control
                <br />
                <strong>Sensor:</strong> Integrated encoder for speed feedback
              </p>
            </div>
          </ContentCard>

          <ContentCard>
            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-green-900 dark:text-green-300">
                Azimuth Motor
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Steers the module by rotating the wheel to the desired angle.
              Requires precise position control with absolute encoder feedback.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <strong>Purpose:</strong> Wheel direction control
                <br />
                <strong>Control:</strong> Position PID with Motion Magic
                <br />
                <strong>Sensor:</strong> Absolute encoder (CANcoder) for angle
              </p>
            </div>
          </ContentCard>

          <ContentCard>
            <div className="bg-orange-100 dark:bg-orange-900/20 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-orange-900 dark:text-orange-300">
                CANcoder
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Absolute position sensor that tracks the steering angle. Critical
              for module zeroing and maintaining accurate wheel orientation.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                <strong>Purpose:</strong> Absolute angle measurement
                <br />
                <strong>Type:</strong> WCP ThroughBore or CANcoder V2
                <br />
                <strong>Units:</strong> Rotations (0 to 1.0)
              </p>
            </div>
          </ContentCard>
        </div>

        <AlertBox variant="warning" title="Module Zeroing is Critical">
          <p className="mb-3">
            Before using swerve drive, each module must be properly zeroed. This
            involves:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
            <li>Manually aligning all wheels to point straight forward</li>
            <li>
              Reading the CANcoder offset values in Phoenix Tuner for each
              module
            </li>
            <li>Recording these offsets in your swerve constants</li>
            <li>Applying the offsets in your azimuth motor configuration</li>
          </ol>
          <p className="mt-3 text-sm">
            Incorrect zeroing will cause erratic driving behavior and prevent
            proper swerve operation.
          </p>
        </AlertBox>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            CTRE Swerve Module Overview
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Watch this overview of swerve module components and how they work
            together:
          </p>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/Gh8R_JIMReQ"
              title="CTRE Swerve Drive Explanation"
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Section 3: Coordinate Systems */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Coordinate Systems &amp; Reference Frames
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          Understanding coordinate systems is crucial for swerve drive control.
          You need to know whether movements are relative to the robot or the
          field.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <ContentCard>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4">
              Robot-Centric (Robot Frame)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              All movements are relative to the robot&apos;s current
              orientation. Forward is always toward the front of the robot.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Forward:</strong> Robot moves in the direction
                  it&apos;s facing
                </li>
                <li>
                  <strong>Strafe Right:</strong> Robot moves to its right side
                </li>
                <li>
                  <strong>Use Case:</strong> Precise maneuvering, driver
                  preference
                </li>
                <li>
                  <strong>Control:</strong> More intuitive for beginners
                </li>
              </ul>
            </div>
          </ContentCard>

          <ContentCard>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-300 mb-4">
              Field-Centric (Field Frame)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              All movements are relative to the field. Forward is always away
              from your driver station, regardless of robot orientation.
            </p>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <strong>Forward:</strong> Robot moves away from driver station
                </li>
                <li>
                  <strong>Strafe Right:</strong> Robot moves right on the field
                </li>
                <li>
                  <strong>Use Case:</strong> Competition driving, intuitive
                  control
                </li>
                <li>
                  <strong>Requirement:</strong> Needs gyro for robot heading
                </li>
              </ul>
            </div>
          </ContentCard>
        </div>

        <AlertBox variant="info" title="Gyro Requirement for Field-Centric">
          <p className="mb-3">
            Field-centric control requires a gyroscope (IMU) to track the
            robot&apos;s heading. Without an accurate heading, the robot cannot
            determine which direction is &quot;forward&quot; relative to the
            field.
          </p>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <p className="mb-2">
              <strong>Common gyros in FRC:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Pigeon 2 (CTRE) - CAN-based, highly accurate</li>
              <li>NavX (Kauai Labs) - USB/SPI, popular choice</li>
              <li>ADIS16470 (Analog Devices) - SPI, WPILib support</li>
            </ul>
          </div>
        </AlertBox>
      </section>

      {/* Section 4: Safety and Best Practices */}
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Safety &amp; Best Practices
        </h2>

        <AlertBox variant="warning" title="Critical Safety Considerations">
          <p className="mb-3">
            Swerve drive robots can move very quickly and in unexpected
            directions. Always follow these safety practices:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
            <li>
              <strong>Verify Module Zeroing:</strong> Incorrect zeroing can
              cause unpredictable movement
            </li>
            <li>
              <strong>Test Drive Direction:</strong> Verify each module drives
              forward before full testing
            </li>
            <li>
              <strong>Test Steering Direction:</strong> Ensure all modules steer
              the correct direction
            </li>
            <li>
              <strong>Apply Deadbands:</strong> Prevent controller drift from
              causing unwanted movement
            </li>
            <li>
              <strong>Limit Initial Speed:</strong> Start with reduced max
              velocity until confident
            </li>
            <li>
              <strong>Use Soft Limits:</strong> Protect the robot and test area
              during development
            </li>
          </ul>
        </AlertBox>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-4">
            Ready for Implementation
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            You now understand the fundamental concepts needed for swerve drive:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>Holonomic motion and independent module control</li>
            <li>Module anatomy: drive motor, azimuth motor, CANcoder</li>
            <li>Coordinate systems: robot-centric vs field-centric</li>
            <li>Gyro requirements for field-centric control</li>
            <li>Critical safety practices and zeroing procedures</li>
          </ul>
          <p className="text-slate-600 dark:text-slate-300 mt-4">
            Next, you&apos;ll learn how to use Phoenix Tuner X to generate a
            complete swerve project and bring up your drivetrain.
          </p>
        </div>
      </section>
    </PageTemplate>
  );
}

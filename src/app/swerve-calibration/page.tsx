import PageTemplate from "@/components/PageTemplate";
import KeyConceptSection from "@/components/KeyConceptSection";
import AlertBox from "@/components/AlertBox";
import ContentCard from "@/components/ContentCard";
import DocumentationButton from "@/components/DocumentationButton";
import ImageBlock from "@/components/ImageBlock";
import { Book, Camera, Settings, Target } from "lucide-react";

export default function OdometryCalibration() {
  return (
    <PageTemplate
      title="Odometry Calibration"
      previousPage={{
        href: "/vision-implementation",
        title: "Implementing Vision",
      }}
      nextPage={{ href: "/vision-shooting", title: "Vision-Based Shooting" }}
    >
      <KeyConceptSection
        title="Calibrating Your Robot's Odometry"
        description="Proper calibration is the foundation of accurate autonomous performance. This includes tuning motor values, finding the effective wheel radius, configuring camera positions, and tuning PID controllers for path following."
        concept="Calibration transforms theoretical parameters into real-world accuracy."
      />

      <p className="text-slate-600 dark:text-slate-300 text-center -mt-4">
        Accurate calibration ensures your robot knows exactly where it is on the
        field, enabling precise autonomous movement and vision integration.
        Below is a graphic showing the order we follow when setting up a robot.
      </p>

      <ImageBlock
        src="/images/odometry-setup/Robot Flowchart.png"
        alt="Odometry calibration setup showing measurement procedure"
      />

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Motor Calibration
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          Start by tuning your drive and turning motors to ensure they respond
          correctly to commands and maintain accurate position tracking.
        </p>

        <ContentCard>
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-primary-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Tune Drive and Turning Motors
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Configure motor PID values, velocity/acceleration limits, and
                ensure proper sensor feedback.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Key Calibration Steps:
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  Make sure to read and follow Tuner X instructions carefully
                </li>
                <li>Verify your robot drives correct direction</li>
                <li>Tune turning motor first then move onto drive motors</li>
                <li>
                  Configure{" "}
                  <a
                    href="https://v6.docs.ctr-electronics.com/en/stable/docs/hardware-reference/talonfx/improving-performance-with-current-limits.html#preventing-wheel-slip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Stator Current
                  </a>{" "}
                  to prevent wheel slippage.
                </li>
              </ul>
            </div>

            <AlertBox variant="tip" title="💡 Encoder Security">
              <p>
                <strong>Highly Recommended:</strong> Glue your drive encoders in
                place to prevent them from shifting during impacts or aggressive
                movements. Even small encoder shifts can cause significant
                odometry drift.
              </p>
            </AlertBox>
          </div>
        </ContentCard>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Effective Wheel Radius
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          The effective wheel radius accounts for compression, tread wear, and
          carpet interaction. This value is critical for accurate odometry.
        </p>

        <ContentCard>
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Wheel Radius Test Procedure
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Follow this systematic procedure to determine your robot&apos;s
                effective wheel radius.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-primary-50 dark:bg-primary-950/30 p-6 rounded-lg border border-primary-200 dark:border-primary-800">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Drive Forward at Low Acceleration
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Command the robot to drive straight forward for a fixed
                      distance (e.g., 3 meters) at low acceleration to minimize
                      wheel slip.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Record Sensor-Reported Distance
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Log the distance traveled as calculated from encoder
                      readings. This will differ from the actual distance due to
                      wheel compression and slip.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-primary-700 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Measure True Distance Traveled
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Use a tape measure to determine the actual distance the
                      robot moved. Measure from the starting position to the
                      final position.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="bg-primary-800 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </span>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      Calculate Rolling Radius
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                      Use this formula:{" "}
                      <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        effectiveRadius = (actualDistance / sensorDistance) *
                        currentRadius
                      </code>
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            <AlertBox variant="warning" title="⚠️ Test Conditions Matter">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Perform this test on the same surface you&apos;ll compete on
                  (carpet vs. tile affects compression)
                </li>
                <li>
                  Run multiple trials and average the results for better
                  accuracy
                </li>
                <li>Re-calibrate if you change wheels or tread</li>
              </ul>
            </AlertBox>
          </div>
        </ContentCard>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Camera Setup & Calibration
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          Accurate camera calibration ensures vision measurements integrate
          correctly with your odometry, providing reliable pose estimates.
        </p>

        <ContentCard>
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Limelight Camera Configuration
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Set up your Limelight camera with proper positioning, focus, and
                calibration.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Camera Setup Checklist:
              </h4>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    1. Camera Position Configuration
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Enter the camera&apos;s position relative to the robot
                    center in the Limelight web interface. Accurate position
                    values are critical for pose estimation.
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    2. Camera Calibration
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Use a Limelight calibration board to calibrate your camera.
                    This corrects for lens distortion and improves pose
                    accuracy, especially at the edges of the field of view.
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    3. Lens Focus & Security
                  </h5>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Ensure the lens is properly focused for your AprilTag
                    detection distance. Once focused,{" "}
                    <strong>glue the lens in place</strong> to prevent it from
                    shifting due to vibrations.
                  </p>
                </div>
              </div>
            </div>

            <AlertBox variant="info" title="📍 Limelight Documentation">
              <p className="mb-2">
                Refer to the official Limelight AprilTag documentation for
                detailed camera calibration instructions and best practices:
              </p>
              <DocumentationButton
                href="https://docs.limelightvision.io/docs/docs-limelight/pipeline-apriltag/apriltag-localization"
                title="Limelight AprilTag Localization Guide"
                icon={<Book className="w-5 h-5" />}
              />
            </AlertBox>
          </div>
        </ContentCard>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          PathPlanner PID Tuning
        </h2>

        <p className="text-slate-600 dark:text-slate-300">
          PathPlanner uses PID controllers to follow autonomous paths
          accurately. Proper tuning ensures your robot tracks paths smoothly
          without oscillation or lag.
        </p>

        <ContentCard>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            PathPlanner Configuration - Do in the GUI
          </h3>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Robot Config should be as accurate as possible to your robot,
                and many configs are available online. However, to significantly
                help path tracking, configure the App Settings, which contain
                the MotionMagic configurations for PathPlanner.
              </h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>
                  <strong>App Setting: Max Velocity:</strong> Set to 80-90% of
                  your robot&apos;s maximum speed. This provides headroom for
                  PID corrections.
                </li>
                <li>
                  <strong>App Setting: Max Acceleration:</strong> Conservative
                  values (2-3 m/s²) prevent wheel slip. Increase gradually while
                  testing.
                </li>
                <li>
                  <strong>App Setting: Max Angular Velocity:</strong> Limit
                  rotational speed to prevent modules from fighting each other.
                </li>
                <li>
                  <strong>App Setting: Max Angular Acceleration:</strong> Limit
                  rotational acceleration to prevent robot from rotating too
                  quickly.
                </li>
              </ul>
            </div>

            <AlertBox variant="tip" title="🎯 Tuning Strategy">
              <p className="mb-2">
                Tune PathPlanner PID values like normal. However be aware that
                due to loop times these cannot be tuned as aggressively.
              </p>
            </AlertBox>
          </div>
        </ContentCard>
      </section>

      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          What&apos;s Next?
        </h2>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-4">
            Up Next: Vision-Based Shooting
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            With your odometry fully calibrated, you&apos;re ready to apply
            vision data for automated targeting and distance-based shooting
            calculations. You&apos;ll learn how to use vision feedback to
            calculate shooter angles and velocities dynamically.
          </p>
        </div>
      </section>
    </PageTemplate>
  );
}

import PageTemplate from "@/components/PageTemplate";
import KeyConceptSection from "@/components/KeyConceptSection";
import AlertBox from "@/components/AlertBox";
import DocumentationButton from "@/components/DocumentationButton";
import { Book } from "lucide-react";

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
                  Click on <strong>Mechanisms</strong> in the left sidebar. This
                  will open the configuration wizard.
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
                  Follow the Steps to Generate and Export
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Click <strong>New Project</strong> and follow the steps in
                  Tuner X to set up and test your swerve drivetrain. Once you
                  finish, click <strong>Generate Project</strong> and
                  you&apos;ll have a completed project fully ready to deploy and
                  drive your robot.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DocumentationButton
          href="https://v6.docs.ctr-electronics.com/en/latest/docs/tuner/tuner-swerve/index.html"
          title="CTRE Swerve Project Generator Documentation"
          icon={<Book className="w-5 h-5" />}
        />
      </section>
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          What&apos;s Next?
        </h2>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border-l-4 border-green-500">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-4">
            Up Next: PathPlanner
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            Now that your swerve project is generated, the next step is
            autonomous path following with PathPlanner.
          </p>
        </div>
      </section>
    </PageTemplate>
  );
}

"use client";
import posthog from "posthog-js";
import { useState } from "react";

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(
    posthog.get_explicit_consent_status() === "pending"
  );

  const handleAccept = () => {
    // Enable PostHog tracking
    posthog.opt_in_capturing();
    setShowBanner(false);
  };

  const handleDecline = () => {
    // Disable PostHog tracking
    posthog.opt_out_capturing();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 p-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-700 dark:text-gray-200">
            We use PostHog analytics with user-identifying features disabled to
            improve our site. Data is aggregated and not used to identify you.
            You can accept or reject analytics.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="cursor-pointer px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="cursor-pointer px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

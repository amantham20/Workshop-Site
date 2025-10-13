import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--muted)] py-6 mt-12 bg-[var(--card)] text-[var(--muted-foreground)] text-center">
      <div className="container mx-auto flex flex-col items-center">
        <span className="text-sm mb-2">
          &copy; {new Date().getFullYear()} Hemlock&apos;s Gray Matter
        </span>
        <Link
          href="/privacy"
          className="text-primary-600 hover:underline text-sm"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}

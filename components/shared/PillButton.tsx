import Link from "next/link";
import { cx } from "@/utils";

// ── Arrow Icon ───────────────────────────────────────────────────────
const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path
      d="M3 8h10M9 4l4 4-4 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Types ────────────────────────────────────────────────────────────
type PillButtonProps = {
  href: string;
  children: React.ReactNode;
  /** "outline" = bordered ghost (default), "solid" = filled */
  variant?: "outline" | "solid";
  arrow?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
};

// ── Size tokens ──────────────────────────────────────────────────────
const sizes = {
  sm: "px-5 py-2 text-xs gap-2",
  md: "px-7 py-3 text-[13px] gap-2.5",
  lg: "px-9 py-3.5 text-sm gap-3",
} as const;

// ── Variant tokens ───────────────────────────────────────────────────
const variants = {
  outline: cx(
    // Resting: subtle border, muted text
    "border border-dark/[0.1] dark:border-light/[0.1]",
    "text-dark/70 dark:text-light/70",
    // Hover: border solidifies to accent, text sharpens, faint fill
    "hover:border-[#6D28D9] dark:hover:border-[#6D28D9]",
    "hover:text-[#6D28D9] dark:hover:text-[#8B5CF6]",
    "hover:bg-[#6D28D9]/[0.03] dark:hover:bg-[#6D28D9]/[0.06]",
  ),
  solid: cx(
    "border border-transparent",
    "bg-[#6D28D9] text-white",
    "hover:bg-[#5B21B6]",
  ),
} as const;

// ── Component ────────────────────────────────────────────────────────
const PillButton = ({
  href,
  children,
  variant = "outline",
  arrow = false,
  size = "md",
  className,
  external = false,
}: PillButtonProps) => {
  const classes = cx(
    "group inline-flex items-center justify-center rounded-full",
    "font-semibold uppercase tracking-[0.12em] whitespace-nowrap",
    "transition-all duration-300 ease-out",
    sizes[size],
    variants[variant],
    className
  );

  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
};

export default PillButton;
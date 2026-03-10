interface HighlightProps {
  children: React.ReactNode;
  className?: string;
  rotate?: string;
  height?: string;
}

const Highlight = ({
  children,
  className = "",
  rotate = "-rotate-1",
  height = "h-3 sm:h-4",
}: HighlightProps) => {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{children}</span>
      <span
        className={`absolute bottom-1 left-0 right-0 ${height} bg-accent/15 dark:bg-accent/20 ${rotate} rounded-sm ${className}`}
      />
    </span>
  );
};

export default Highlight;

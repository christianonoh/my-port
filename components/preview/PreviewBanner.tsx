/* eslint-disable @next/next/no-html-link-for-pages */

export function PreviewBanner() {
  return (
    <div className="p-3 text-center text-white bg-black">
      {"Previewing drafts. "}
      <a
        className="underline transition hover:opacity-50"
        href="/api/disable-draft"
        aria-label="Click here to exit preview mode"
      >
        Back to published
      </a>
    </div>
  );
}

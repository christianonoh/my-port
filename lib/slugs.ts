import GithubSlugger from "github-slugger";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Extract TOC items from PortableText blocks.
 * Returns the same slugs that will be used as heading IDs.
 */
export function extractTocFromPortableText(blocks: any[]): TocItem[] {
  const slugger = new GithubSlugger();
  return blocks
    .filter(
      (block: any) =>
        block._type === "block" && ["h1", "h2", "h3"].includes(block.style)
    )
    .map((block: any) => {
      const text =
        block.children?.map((child: any) => child.text).join("") || "";
      return {
        id: slugger.slug(text),
        text,
        level: parseInt(block.style.replace("h", ""), 10),
      };
    });
}

/**
 * Extract TOC items from markdown content.
 * Returns the same slugs that will be used as heading IDs.
 */
export function extractTocFromMarkdown(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    items.push({
      id: slugger.slug(match[2].trim()),
      text: match[2].trim(),
      level: match[1].length,
    });
  }

  return items;
}

/**
 * Generate a slug for a heading.
 * Pass a shared GithubSlugger instance so duplicates get proper suffixes.
 */
export function slugifyHeading(slugger: GithubSlugger, text: string): string {
  return slugger.slug(text);
}

/**
 * Extract plain text from PortableText block children.
 * This reads from the raw block data, NOT from React children.
 */
export function getBlockText(block: any): string {
  return block.children?.map((child: any) => child.text).join("") || "";
}

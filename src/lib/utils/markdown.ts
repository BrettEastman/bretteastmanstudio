import { Marked, Renderer, type Tokens } from "marked";

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

const defaultRenderer = new Renderer();

function isSafeUrl(href: string): boolean {
  try {
    return SAFE_PROTOCOLS.has(
      new URL(href, "https://relative.invalid").protocol,
    );
  } catch {
    return false;
  }
}

/**
 * Raw HTML is dropped and only http/https/mailto URLs are kept, so the only
 * markup that survives is generated (and escaped) by marked's own renderers.
 */
const safeRenderer = {
  html(): string {
    return "";
  },
  link(this: Renderer, token: Tokens.Link): string {
    if (!isSafeUrl(token.href)) return this.parser.parseInline(token.tokens);
    return defaultRenderer.link.call(this, token);
  },
  image(this: Renderer, token: Tokens.Image): string {
    if (!isSafeUrl(token.href)) return token.text;
    return defaultRenderer.image.call(this, token);
  },
};

const parser = new Marked({ renderer: safeRenderer });

/**
 * Converts a markdown string to sanitized HTML for use with Svelte's {@html}.
 * Used for rendering AI chat responses (and optionally user messages).
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown?.trim()) return "";
  return parser.parse(markdown.trim(), { async: false }) as string;
}

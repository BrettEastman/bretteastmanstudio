import { marked } from "marked";

/**
 * Converts a markdown string to HTML for use with Svelte's {@html}.
 * Used for rendering AI chat responses (and optionally user messages).
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown?.trim()) return "";
  return marked.parse(markdown.trim(), { async: false }) as string;
}

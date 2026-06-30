// @ts-ignore
import katex from "katex";

/**
 * Parses a string and replaces inline math ($...$) with KaTeX rendered HTML.
 */
export function parseMathInText(text: string): string {
  if (!text) return text;

  // Regex to match inline math: $...$
  return text.replace(/\$([^\$]+)\$/g, (match, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (e) {
      return match; // Fallback to original text on error
    }
  });
}

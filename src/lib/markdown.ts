import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

export function renderMarkdown(body: string): string {
  return DOMPurify.sanitize(marked.parse(body, { async: false }));
}

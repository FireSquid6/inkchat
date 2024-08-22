import { Marked } from "marked"
import DOMPurify from "dompurify"


// TODO - latex support?
// TODO - code highlighting?
export function parseMarkdown(text: string): string {
  // removes some zero-width characters that can cause issues
  text = text.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")

  const marked = new Marked()
  const html = marked.parse(text, {
    async: false,
  })


  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
}

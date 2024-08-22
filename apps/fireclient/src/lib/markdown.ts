import { Marked } from "marked"


// TODO - sanitize? not sure if that's necessary
// TODO - latex support?
// TODO - code highlighting?
export function parseMarkdown(text: string): string {
  // removes some zero-width characters that can cause issues
  text = text.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")

  const marked = new Marked()
  const html = marked.parse(text, {
    async: false,
  })

  return html
}

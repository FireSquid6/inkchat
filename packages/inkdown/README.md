# inkdown

Inkdown is a lightweight markdown-ish parser built for messaging applications

## Goals
- Fast - parsing should be able to be done on the client side with
- Simple - no weird magic stuff. Just a function that turns inkdown into html or provided 
- Customizable - enable and disable certain features
- Safe - no XSS attacks should be possible by default

## Nongoals
- follow the markdown spec


# Syntax

```inkdown
you can type in just paragraph text like this.
linefeeds are respected, unlike markdown. This linefeed would be rendered.

\`\`\`language
This is a monospaced code block
\`\`\`

you can insert **bold**, *italics*, __underline__, `code`, and ||spoilers|| into your markdown

You can also do blockquotes:
> this is a quote

- lists
- work
- like
- this

~ ordered
~ lists
~ work
~ like
~ this

Ordered lists can also be done "ad-hoc" with 1., 2., 3., etc. If the order is broken, it won't work


- lists
-- can
--- be nested

The nesting can be turned off


Fancy plugins can include $math$, but that isn't strictly necessary since latex can be slow.

```


# Using inkdown
TODO - but in general inkdown will take in an input of 


# Options
- `max-list-nexting`
- `use-latex`
- `enable-underline`
- `enable-bold`
- `enable-italics`
- `enable-code`
- `enable-spoilers`

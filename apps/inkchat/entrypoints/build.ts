console.log("building...")

await Bun.build({
  entrypoints: ['entrypoints/prod.ts'],
  target: 'bun',
  minify: true,
  outdir: 'dist',
  sourcemap: "inline",
})

export {}

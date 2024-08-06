console.log("building...")

const result = await Bun.build({
  entrypoints: ['entrypoints/prod.ts'],
  target: 'bun',
  minify: true,
  outdir: 'dist',
  sourcemap: "external",
})

console.log(result)

export {}

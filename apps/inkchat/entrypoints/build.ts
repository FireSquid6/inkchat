await Bun.build({
  entrypoints: ['entrypoints/prod.ts'],
  target: 'bun',
  minify: true,
  outdir: 'dist',
})

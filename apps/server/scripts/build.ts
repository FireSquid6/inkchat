await Bun.build({
  entrypoints: ['scripts/prod.ts'],
  target: 'bun',
  minify: true,
  outdir: 'dist',
})

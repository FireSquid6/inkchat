await Bun.build({
  entrypoints: ['scripts/prod.ts'],
  target: 'bun',
  outdir: 'dist',
})

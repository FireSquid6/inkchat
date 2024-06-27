const result = await Bun.build({
  entrypoints: ['scripts/prod.ts', './public.ts'],
  target: 'bun',
  outdir: 'dist',
})

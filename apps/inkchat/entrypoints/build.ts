console.log("building...")

await Bun.build({
  entrypoints: ["entrypoints/prod.ts"],
  target: "bun",
  minify: true,
  outdir: "js-dist",
  sourcemap: "external"
})


const platforms: string[] = []

for (const platform of platforms) {
  await Bun.build({
    entrypoints: ["entrypoints/prod.ts"],
    target: "bun", 
    outdir: "bin",
    naming: `[dir]/inkchat-${platform}.[ext]`,
  })

}


export {}

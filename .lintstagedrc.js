const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{md,mdx,js,jsx,ts,tsx,cjs,mjs,json,css}': [buildEslintCommand],
  '*.{md,mdx,js,jsx,ts,tsx,cjs,mjs,json,css}': ['prettier --write --cache']
}

#!/usr/bin/env node
/**
 * Complete Toast Migration Script
 * Migrates all old toast implementations to showCustomToast
 */

const fs = require('fs')
const path = require('path')
const { glob } = require('glob')

let filesUpdated = 0
let toastsReplaced = 0

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let modified = false
  let fileToastCount = 0

  // Skip if already using showCustomToast
  if (content.includes('showCustomToast')) {
    return
  }

  // Skip if no toast usage
  if (!content.includes('toast')) {
    return
  }

  // Replace toast.success
  const successMatches = content.match(/toast\.success\(/g)
  if (successMatches) {
    content = content.replace(
      /toast\.success\(['"`]([^'"`]+)['"`]\)/g,
      (match, msg) => `showCustomToast('Success', '${msg}', 'success', 5000)`
    )
    fileToastCount += successMatches.length
    modified = true
  }

  // Replace toast.error with complex expressions
  const errorMatches = content.match(/toast\.error\(/g)
  if (errorMatches) {
    content = content.replace(/toast\.error\(([^)]+)\)/g, (match, expr) => {
      // Simple string
      if (expr.match(/^['"`][^'"`]+['"`]$/)) {
        const msg = expr.replace(/['"` ]/g, '')
        return `showCustomToast('Error', '${msg}', 'error', 5000)`
      }
      // Expression
      return `showCustomToast('Error', ${expr}, 'error', 5000)`
    })
    fileToastCount += errorMatches.length
    modified = true
  }

  // Replace toast.warning
  const warningMatches = content.match(/toast\.warning\(/g)
  if (warningMatches) {
    content = content.replace(/toast\.warning\(([^)]+)\)/g, (match, expr) => {
      if (expr.match(/^['"`][^'"`]+['"`]$/)) {
        const msg = expr.replace(/['"` ]/g, '')
        return `showCustomToast('Warning', '${msg}', 'error', 5000)`
      }
      return `showCustomToast('Warning', ${expr}, 'error', 5000)`
    })
    fileToastCount += warningMatches.length
    modified = true
  }

  // Replace toast.info
  const infoMatches = content.match(/toast\.info\(/g)
  if (infoMatches) {
    content = content.replace(/toast\.info\(([^)]+)\)/g, (match, expr) => {
      if (expr.match(/^['"`][^'"`]+['"`]$/)) {
        const msg = expr.replace(/['"` ]/g, '')
        return `showCustomToast('Info', '${msg}', 'info', 5000)`
      }
      return `showCustomToast('Info', ${expr}, 'info', 5000)`
    })
    fileToastCount += infoMatches.length
    modified = true
  }

  // Replace simple toast()
  const simpleMatches = content.match(/\btoast\(['"`]/g)
  if (simpleMatches) {
    content = content.replace(
      /\btoast\(['"`]([^'"`]+)['"`]\)/g,
      (match, msg) => `showCustomToast('Notification', '${msg}', 'info', 5000)`
    )
    fileToastCount += simpleMatches.length
    modified = true
  }

  if (!modified) {
    return
  }

  // Remove old imports
  content = content.replace(
    /import\s*{\s*toast\s*}\s*from\s*['"]sonner['"]\s*\n?/g,
    ''
  )
  content = content.replace(
    /import\s*{\s*toast\s*}\s*from\s*['"]react-toastify['"]\s*\n?/g,
    ''
  )

  // Add new import if not present
  if (!content.includes("from '@/components/custom-toast'")) {
    // Find last import
    const importRegex = /^import\s+.*from\s+['"].*['"];?\s*$/gm
    const imports = [...content.matchAll(importRegex)]

    if (imports.length > 0) {
      const lastImport = imports[imports.length - 1]
      const insertPos = lastImport.index + lastImport[0].length
      content =
        content.slice(0, insertPos) +
        "\nimport { showCustomToast } from '@/components/custom-toast'" +
        content.slice(insertPos)
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8')
  filesUpdated++
  toastsReplaced += fileToastCount
  console.log(`✓ ${filePath} (${fileToastCount} toasts)`)
}

// Find all TS/TSX files
const files = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/custom-toast.tsx', '**/sonner.tsx']
})

console.log(`Found ${files.length} files to check...\n`)

files.forEach(migrateFile)

console.log(`\n✅ Migration complete!`)
console.log(`📊 Updated ${filesUpdated} files`)
console.log(`🔄 Replaced ${toastsReplaced} toast calls`)

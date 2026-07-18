#!/usr/bin/env node
/**
 * Complete Toast Migration Script - Production Ready
 * Migrates ALL remaining old toast implementations to showCustomToast
 */

const fs = require('fs')
const path = require('path')

let filesUpdated = 0
let toastsReplaced = 0
let errors = []

// Get all TypeScript/TSX files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath)

  files.forEach((file) => {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles)
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      arrayOfFiles.push(filePath)
    }
  })

  return arrayOfFiles
}

function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    let modified = false
    let fileToastCount = 0

    // Skip if already using showCustomToast or no toast usage
    if (content.includes('showCustomToast') || !content.includes('toast')) {
      return
    }

    // Skip custom-toast.tsx and sonner.tsx
    if (
      filePath.includes('custom-toast.tsx') ||
      filePath.includes('sonner.tsx')
    ) {
      return
    }

    const original = content

    // Replace toast.success with proper handling
    content = content.replace(
      /toast\.success\((['"`])([^'"`]+)\1\)/g,
      (match, quote, msg) => {
        fileToastCount++
        return `showCustomToast('Success', '${msg.replace(/'/g, "\\'")}', 'success', 5000)`
      }
    )

    // Replace toast.error with string literals
    content = content.replace(
      /toast\.error\((['"`])([^'"`]+)\1\)/g,
      (match, quote, msg) => {
        fileToastCount++
        return `showCustomToast('Error', '${msg.replace(/'/g, "\\'")}', 'error', 5000)`
      }
    )

    // Replace toast.error with expressions (error.message, etc.)
    content = content.replace(/toast\.error\(([^)]+)\)/g, (match, expr) => {
      // Skip if already handled as string literal
      if (expr.match(/^['"`]/)) return match
      fileToastCount++
      return `showCustomToast('Error', ${expr}, 'error', 5000)`
    })

    // Replace toast.warning
    content = content.replace(
      /toast\.warning\((['"`])([^'"`]+)\1\)/g,
      (match, quote, msg) => {
        fileToastCount++
        return `showCustomToast('Warning', '${msg.replace(/'/g, "\\'")}', 'error', 5000)`
      }
    )

    content = content.replace(/toast\.warning\(([^)]+)\)/g, (match, expr) => {
      if (expr.match(/^['"`]/)) return match
      fileToastCount++
      return `showCustomToast('Warning', ${expr}, 'error', 5000)`
    })

    // Replace toast.info
    content = content.replace(
      /toast\.info\((['"`])([^'"`]+)\1\)/g,
      (match, quote, msg) => {
        fileToastCount++
        return `showCustomToast('Info', '${msg.replace(/'/g, "\\'")}', 'info', 5000)`
      }
    )

    content = content.replace(/toast\.info\(([^)]+)\)/g, (match, expr) => {
      if (expr.match(/^['"`]/)) return match
      fileToastCount++
      return `showCustomToast('Info', ${expr}, 'info', 5000)`
    })

    // Replace simple toast() calls
    content = content.replace(
      /\btoast\((['"`])([^'"`]+)\1\)/g,
      (match, quote, msg) => {
        fileToastCount++
        return `showCustomToast('Notification', '${msg.replace(/'/g, "\\'")}', 'info', 5000)`
      }
    )

    content = content.replace(/\btoast\(([^)]+)\)/g, (match, expr) => {
      // Skip if already handled or if it's a property access
      if (expr.match(/^['"`]/) || expr.includes('.')) return match
      fileToastCount++
      return `showCustomToast('Notification', ${expr}, 'info', 5000)`
    })

    modified = content !== original

    if (!modified || fileToastCount === 0) {
      return
    }

    // Remove old imports
    content = content.replace(
      /^import\s*{\s*toast\s*}\s*from\s*['"]sonner['"]\s*\n?/gm,
      ''
    )
    content = content.replace(
      /^import\s*{\s*toast\s*}\s*from\s*['"]react-toastify['"]\s*\n?/gm,
      ''
    )

    // Add new import if not present
    if (!content.includes("from '@/components/custom-toast'")) {
      // Find position after last import
      const lines = content.split('\n')
      let lastImportIndex = -1

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^import\s+/)) {
          lastImportIndex = i
        }
      }

      if (lastImportIndex >= 0) {
        lines.splice(
          lastImportIndex + 1,
          0,
          "import { showCustomToast } from '@/components/custom-toast'"
        )
        content = lines.join('\n')
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8')
    filesUpdated++
    toastsReplaced += fileToastCount
    const relativePath = filePath.replace(process.cwd(), '').replace(/\\/g, '/')
    console.log(`✓ ${relativePath} (${fileToastCount} toasts)`)
  } catch (error) {
    errors.push({ file: filePath, error: error.message })
    console.error(`✗ Error in ${filePath}:`, error.message)
  }
}

// Main execution
console.log('🚀 Starting complete toast migration...\n')

const srcPath = path.join(process.cwd(), 'src')
const files = getAllFiles(srcPath)

console.log(`📁 Found ${files.length} TypeScript files\n`)
console.log('🔄 Processing files...\n')

files.forEach(migrateFile)

console.log('\n' + '='.repeat(60))
console.log('✅ Migration Complete!')
console.log('='.repeat(60))
console.log(`📊 Files Updated: ${filesUpdated}`)
console.log(`🔄 Toast Calls Migrated: ${toastsReplaced}`)

if (errors.length > 0) {
  console.log(`\n⚠️  Errors: ${errors.length}`)
  errors.forEach(({ file, error }) => {
    console.log(`  - ${file}: ${error}`)
  })
}

console.log(
  '\n✨ All toast implementations have been migrated to showCustomToast!'
)
console.log('🎯 Next steps:')
console.log('  1. Run: pnpm run lint --fix')
console.log('  2. Run: pnpm run build')
console.log('  3. Test your application thoroughly\n')

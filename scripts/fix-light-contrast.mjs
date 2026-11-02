import fs from 'fs'
import path from 'path'

const root = path.resolve('src')
const skipFiles = new Set(['GlassButton.tsx', 'ToastContainer.tsx'])

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (/\.tsx$/.test(ent.name)) out.push(p)
  }
  return out
}

const files = walk(root)
let changed = 0

for (const file of files) {
  const base = path.basename(file)
  if (skipFiles.has(base)) continue
  let s = fs.readFileSync(file, 'utf8')
  const orig = s

  const protect = []
  const keep = (re, label) => {
    s = s.replace(re, (m) => {
      protect.push(m)
      return `___P${protect.length - 1}___`
    })
  }

  keep(/text-slate-900 dark:text-white/g)
  keep(/text-slate-800 dark:text-slate-100/g)
  keep(/text-slate-700 dark:text-slate-200/g)
  keep(/text-slate-600 dark:text-slate-300/g)
  keep(/text-slate-500 dark:text-slate-400/g)
  keep(/text-emerald-700 dark:text-emerald-\d+/g)
  keep(/text-emerald-600 dark:text-emerald-\d+/g)
  keep(/text-amber-700 dark:text-amber-\d+/g)
  keep(/text-rose-700 dark:text-rose-\d+/g)
  keep(/text-violet-700 dark:text-violet-\d+/g)
  keep(/hover:text-emerald-800 dark:hover:text-emerald-\d+/g)
  keep(/hover:text-slate-900 dark:hover:text-slate-\d+/g)
  keep(/!text-white/g)

  s = s.replace(/\btext-white\b/g, 'text-slate-900 dark:text-white')
  s = s.replace(/\btext-slate-100\b/g, 'text-slate-800 dark:text-slate-100')
  s = s.replace(/\btext-slate-200\b/g, 'text-slate-700 dark:text-slate-200')
  s = s.replace(/\btext-slate-300\b/g, 'text-slate-600 dark:text-slate-300')
  s = s.replace(/\btext-slate-400\b/g, 'text-slate-500 dark:text-slate-400')
  s = s.replace(/\btext-slate-500\b(?! dark:)/g, 'text-slate-500 dark:text-slate-400')
  s = s.replace(/\btext-emerald-300\b/g, 'text-emerald-700 dark:text-emerald-300')
  s = s.replace(/\btext-emerald-200\b/g, 'text-emerald-700 dark:text-emerald-200')
  s = s.replace(/\btext-amber-200\b/g, 'text-amber-700 dark:text-amber-200')
  s = s.replace(/\btext-amber-300\b/g, 'text-amber-700 dark:text-amber-300')
  s = s.replace(/\btext-rose-300\b/g, 'text-rose-700 dark:text-rose-300')
  s = s.replace(/\btext-violet-200\b/g, 'text-violet-700 dark:text-violet-200')
  s = s.replace(/\btext-violet-300\b/g, 'text-violet-700 dark:text-violet-300')
  s = s.replace(/\btext-teal-200\b/g, 'text-teal-800 dark:text-teal-200')
  s = s.replace(/\bhover:text-emerald-200\b/g, 'hover:text-emerald-800 dark:hover:text-emerald-200')
  s = s.replace(/\bhover:text-slate-200\b/g, 'hover:text-slate-900 dark:hover:text-slate-200')

  // Remove tilt props (no 3D rotation)
  s = s.replace(/\s+tilt=\{[^}]*\}/g, '')
  s = s.replace(/\s+tilt(?=[\s/>])/g, '')

  s = s.replace(/___P(\d+)___/g, (_, i) => protect[Number(i)])

  if (s !== orig) {
    fs.writeFileSync(file, s)
    changed++
    console.log('updated', path.relative(root, file))
  }
}

console.log('files changed:', changed)

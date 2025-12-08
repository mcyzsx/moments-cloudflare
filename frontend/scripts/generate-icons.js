// scripts/generate-icons.js (ESM)
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

// 创建目录
const iconsDir = join(__dirname, '../public/icons')
const screenshotsDir = join(__dirname, '../public/screenshots')
if (!existsSync(iconsDir)) mkdirSync(iconsDir, { recursive: true })
if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true })

// 图标尺寸
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512]

// 生成 SVG 图标
function svgIcon(size) {
  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#3B82F6" rx="${size * 0.2}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}"
            font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">M</text>
    </svg>
  `
}

// 生成图标
for (const size of iconSizes) {
  const buffer = Buffer.from(svgIcon(size))
  await sharp(buffer).png().toFile(join(iconsDir, `icon-${size}x${size}.png`))
  console.log(`✔ icon-${size}x${size}.png`)
}

// 生成占位截图
const desktopSvg = `
  <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
    <rect width="1280" height="720" fill="#f8fafc"/>
    <rect x="100" y="50" width="1080" height="80" fill="#ffffff" rx="8"/>
    <rect x="100" y="150" width="1080" height="200" fill="#ffffff" rx="8"/>
    <rect x="100" y="370" width="1080" height="200" fill="#ffffff" rx="8"/>
    <text x="640" y="400" font-family="Arial" font-size="48" text-anchor="middle" fill="#6b7280">Moments Desktop</text>
  </svg>
`
const mobileSvg = `
  <svg width="390" height="844" xmlns="http://www.w3.org/2000/svg">
    <rect width="390" height="844" fill="#f8fafc"/>
    <rect x="20" y="100" width="350" height="150" fill="#ffffff" rx="8"/>
    <rect x="20" y="270" width="350" height="150" fill="#ffffff" rx="8"/>
    <rect x="20" y="440" width="350" height="150" fill="#ffffff" rx="8"/>
    <text x="195" y="650" font-family="Arial" font-size="32" text-anchor="middle" fill="#6b7280">Moments Mobile</text>
  </svg>
`

await sharp(Buffer.from(desktopSvg)).png().toFile(join(screenshotsDir, 'desktop-1.png'))
await sharp(Buffer.from(mobileSvg)).png().toFile(join(screenshotsDir, 'mobile-1.png'))
console.log('✔ 截图生成完成')
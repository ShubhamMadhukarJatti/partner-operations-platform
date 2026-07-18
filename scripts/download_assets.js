const fs = require('fs')
const http = require('http')
const path = require('path')

const assets = [
  {
    url: 'http://localhost:3845/assets/4c2a2eb90e0156bc2d7c505fa1cc005b636e341d.png',
    dest: 'public/images/pablo.png'
  },
  {
    url: 'http://localhost:3845/assets/99e50f409fc1e62272e4081cc42b64805b1c9b49.png',
    dest: 'public/images/chris.png'
  }
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    http
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`))
          return
        }
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`Downloaded ${url} to ${dest}`)
          resolve()
        })
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })
  })
}

async function main() {
  // Ensure public/images exists
  const dir = 'public/images'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  for (const asset of assets) {
    try {
      await download(asset.url, asset.dest)
    } catch (err) {
      console.error(err)
    }
  }
}

main()

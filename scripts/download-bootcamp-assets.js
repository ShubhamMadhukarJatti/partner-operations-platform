const http = require('http')
const fs = require('fs')
const path = require('path')

const assets = [
  'b272d81c1c8f571d7d6aa6ab6f579e767e296ea2.svg',
  'c7d10247ffd7b278251c8719abc85545783a9882.svg',
  '2101b12de10c91826307fa33b6e8bb50d8912a7f.svg',
  'ca03c8cdad8e80fa025e0292931315969d3479bd.svg',
  '00d93fbffe32eb7c9f51ae085f6c5fd80c227766.svg',
  'db9b7a13d7f43e002ff6e4d8898fc4e541e2dc12.svg',
  '4cd7af39055266caad6edca3cb7d053f3fe5ee7e.svg',
  '06cc2b99a4eafdbd4d83752427e8a52d0883a827.svg',
  '54f3bffdb7d3f9011678ff46551aed1716074688.svg',
  '0d2080f25f9a39e4cc5f574f6bf0fbbb2deafd50.svg',
  '371f6a2066fac01f7565f51e98467017b81c7db0.svg',
  '5bfa1566cc30f660481b304980f00ef0df07c222.svg',
  'e38f8e7934071a0ebac86be90662f99233167655.svg',
  '9aae2d9d1e29f62d116c3614570822e9033fe4ab.svg'
]

const destDir = path.join(
  __dirname,
  '..',
  'public',
  'assets',
  'partner-bootcamp'
)

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

async function download(filename) {
  const url = `http://localhost:3845/assets/${filename}`
  const destPath = path.join(destDir, filename)
  return new Promise((resolve, reject) => {
    console.log(`Starting request for ${filename}...`)
    http
      .get(url, (res) => {
        console.log(
          `Received response for ${filename}: status=${res.statusCode}`
        )
        if (res.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download ${filename}: status code ${res.statusCode}`
            )
          )
          return
        }
        const fileStream = fs.createWriteStream(destPath)
        res.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          console.log(`Downloaded ${filename} successfully`)
          resolve()
        })
      })
      .on('error', (err) => {
        console.error(`Error requesting ${filename}:`, err)
        reject(err)
      })
  })
}

async function main() {
  for (const asset of assets) {
    try {
      await download(asset)
    } catch (err) {
      console.error(`Caught error for ${asset}:`, err)
    }
  }
}

main()

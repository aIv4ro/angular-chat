import fs from 'fs'

const imagesFolder = './public/tmp/image'
const videosFolder = './public/tmp/video'

const tmpFiles = [
  ...fs.readdirSync(imagesFolder).map(fName => `${imagesFolder}/${fName}`),
  ...fs.readdirSync(videosFolder).map(fName => `${videosFolder}/${fName}`)
]

tmpFiles.forEach(fPath => fs.unlinkSync(fPath))

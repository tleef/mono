import fs from 'fs'

export default (path, text) => {
  fs.writeFileSync(path, text)
}
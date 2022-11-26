import {fileURLToPath, pathToFileURL} from 'url'
import *  as path from 'node:path'
import { readdir } from 'node:fs/promises'



const router = new Map

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const baseDir= path.join(__dirname, 'routes')

async function loadRoute(dirname, base){
  const relPath = path.join(base, dirname)
  const workdir = path.join(baseDir, relPath)

  const directories = await readdir(workdir, {withFileTypes: true})
  for(const entry of directories){
    if(entry.isDirectory()){
      return loadRoute(entry.name, relPath)
    }else if(entry.isFile() && path.extname(entry.name) === '.js' && path.basename(entry.name, '.js') === 'index'){
      const modulePath = pathToFileURL(path.join(workdir, entry.name))
      let module = await import(modulePath)
      router.set(relPath.replaceAll(path.set, '/'), {...module})
    }
  }

}

await loadRoute('', path.sep)

console.log(router)

export default router

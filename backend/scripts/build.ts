import * as esbuild from 'esbuild'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'

const __dirname = path.resolve(path.dirname(''))
async function build () {
  try {
    console.log('Building backend...')
    const start = Date.now()
    // Clear the dist folder
    await fs.rm(__dirname + '/dist', { recursive: true, force: true })
    await esbuild.build({
      logLevel: 'debug',
      entryPoints: [__dirname + '/index.ts'],
      bundle: true,
      outfile: __dirname + '/dist/index.cjs',
      minify: true,
      platform: 'node',
      packages: 'external',
      target: ['node16']
    })

    console.log('Backend built successfully!')
    console.log('Time:', Date.now() - start, 'ms')
  } catch (error) {
    console.error('Build failed:', error)
    process.exit(1)
  }
}

build()

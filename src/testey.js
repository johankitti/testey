const fs = require('fs')
const chalk = require('chalk')

const { argv } = process
const paths = argv.splice(2)
paths.forEach(path => {
  try {
    fs.readdirSync(path)
  } catch (dirErr) {
    try {
      fs.readFileSync(path)
    } catch (fileErr) {
      throw new Error(dirErr || fileErr)
    }
  }
})
const ignores = ['__tests__', 'node_modules']

let fwot = []

let fwt = []

const scanForTests = currPath => {
  try {
    fs.readdirSync(currPath).forEach(path => {
      if (!ignores.includes(path)) {
        scanForTests(`${currPath}/${path}`)
      }
    })
  } catch (err) {
    if (
      !currPath.endsWith('spec.js') &&
      !currPath.endsWith('min.js') &&
      !currPath.endsWith('config.js') &&
      !currPath.endsWith('dev.js') &&
      currPath.endsWith('.js')
    ) {
      const pathParts = currPath.split('/')
      const testFileName = pathParts[pathParts.length - 1]
      const pathNameToTest = `${currPath.split(`/${testFileName}`).join('')}/__tests__/${testFileName.split('.')[0]}.spec.js`
      try {
        fs.readFileSync(pathNameToTest)
        fwt.push(currPath)
      } catch (error) {
        fwot.push(currPath)
      }
    }
  }
}

const results = paths.reduce((agg, path) => {
  fwot = []
  fwt = []
  console.log(`Scanning ${path} for tests...`)
  scanForTests(path)
  return {
    ...agg,
    [path]: {
      filesWithoutTests: fwot,
      filesWithTests: fwt,
    },
  }
}, {})

console.log('')
paths
  .filter(path => !path.endsWith('.js'))
  .forEach(path => {
    const { filesWithoutTests, filesWithTests } = results[path]
    const totalFiles = filesWithTests.length + filesWithoutTests.length
    const fileCoveragePercentage = ((filesWithTests.length / totalFiles) * 100).toFixed(1)
    console.log('\x1b[36m%s\x1b[0m', `=== Status for ${path} ===`)

    console.log(`Files with tests ${filesWithTests.length}/${totalFiles} (${fileCoveragePercentage}%)`)
  })

const singleFilePaths = paths.filter(path => path.endsWith('.js'))
const singleFilesWithoutTests =
  singleFilePaths.map(path => results[path]).reduce((agg, result) => agg + result.filesWithoutTests.length, 0) > 0
if (singleFilesWithoutTests) {
  console.log('\x1b[36m%s\x1b[0m', '=== Files without tests ===')
  singleFilePaths.forEach(path => {
    const { filesWithoutTests } = results[path]
    if (filesWithoutTests.length) {
      console.log(path)
    }
  })
}
console.log('')

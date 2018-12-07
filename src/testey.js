#! /usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const parseConfig = require('./parseConfig')
const defaultConfig = require('../defaultConfig')

const { log } = console
const { argv } = process
const config = parseConfig(argv, defaultConfig)

const { paths, ignoreFolders, relativePath } = config
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

let fwot = []
let fwt = []

const scanForTests = currPath => {
  try {
    fs.readdirSync(currPath).forEach(path => {
      if (!ignoreFolders.includes(path)) {
        scanForTests(`${currPath}/${path}`)
      }
    })
  } catch (err) {
    if (
      !currPath.endsWith('.spec.js') &&
      !currPath.endsWith('.test.js') &&
      !currPath.endsWith('.min.js') &&
      !currPath.endsWith('.config.js') &&
      !currPath.endsWith('.dev.js') &&
      currPath.endsWith('.js')
    ) {
      const pathParts = currPath.split('/')
      const testFileName = pathParts[pathParts.length - 1]
      const pathNameToTest = `${currPath.split(`/${testFileName}`).join('')}/${relativePath}${testFileName.split('.')[0]}${config.fileEnd}`
      try {
        fs.readFileSync(pathNameToTest)
        fwt.push(currPath)
      } catch (error) {
        fwot.push(currPath)
      }
    }
  }
}

log('')
const results = paths.reduce((agg, path) => {
  fwot = []
  fwt = []
  log(chalk.white.bgBlue(` Scanning ${path} for tests... `))
  scanForTests(path)
  return {
    ...agg,
    [path]: {
      filesWithoutTests: fwot,
      filesWithTests: fwt,
    },
  }
}, {})

log('')
log('=== Results ===')
paths
  .filter(path => !path.endsWith('.js'))
  .forEach(path => {
    const { filesWithoutTests, filesWithTests } = results[path]
    const totalFiles = filesWithTests.length + filesWithoutTests.length
    const fileCoveragePercentage = ((filesWithTests.length / (totalFiles || 1)) * 100).toFixed(1)

    const colorWrapper = fileCoveragePercentage === 100 ? chalk.white.bgGreen : chalk.white.bgRed
    log(`${path} ${filesWithTests.length}/${totalFiles} ${colorWrapper(`(${fileCoveragePercentage}%)`)}`)
  })

const singleFilePaths = paths.filter(path => path.endsWith('.js'))
const singleFilesWithoutTests =
  singleFilePaths.map(path => results[path]).reduce((agg, result) => agg + result.filesWithoutTests.length, 0) > 0
if (singleFilesWithoutTests) {
  log('=== Files without tests ===')
  singleFilePaths.forEach(path => {
    const { filesWithoutTests } = results[path]
    if (filesWithoutTests.length) {
      log(chalk.white.bgRed(path))
    }
  })
} else if (singleFilePaths.length) {
  log(chalk.black.bgGreen(' All files have tests! '))
}
log('')

#! /usr/bin/env node

const fs = require('fs')
const chalk = require('chalk')
const parseConfig = require('./parseConfig')
const main = require('./main')
const defaultConfig = require('../defaultConfig')

const { log } = console
const [, , ...args] = process.argv
const config = parseConfig(args, defaultConfig)

const { paths } = config
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

// Run main program
const results = main(config)

const dirPaths = paths.filter(path => !path.endsWith('.js'))
log('')
if (dirPaths.length) {
  log('=== Results ===')
}
dirPaths.forEach(path => {
  const { filesWithoutTests, filesWithTests } = results[path]
  const totalFiles = filesWithTests.length + filesWithoutTests.length
  const fileCoveragePercentage = !totalFiles ? '100.0' : ((filesWithTests.length / totalFiles) * 100).toFixed(1)

  const colorWrapper = fileCoveragePercentage === '100.0' ? chalk.white.bgGreen : chalk.white.bgRed
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

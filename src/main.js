const fs = require('fs')
const chalk = require('chalk')
const { log } = console

let fwot = []
let fwt = []

const scanForTests = (currPath, config) => {
  const { paths, ignoreFolders, relativePath, check } = config
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
    const pathToTestParts = `${currPath.split(`/${testFileName}`).join('')}/${relativePath}${testFileName.split('.')[0]}${
      config.fileEnd
    }`.split('/')
    const pathNameToTest = pathToTestParts
      .filter((dir, index) => {
        if (dir === '..' || (index < pathToTestParts.length && pathToTestParts[index + 1] === '..')) {
          return false
        }
        return true
      })
      .join('/')
    try {
      fs.readFileSync(pathNameToTest)
      fwt.push(currPath)
    } catch (error) {
      fwot.push(currPath)
      if (check) {
        throw new Error(`No test file for ${currPath} !`)
      }
    }
  } else {
    let pathsToTry = []
    try {
      pathsToTry = fs.readdirSync(currPath)
    } catch (err) {
    } finally {
      pathsToTry.forEach(path => {
        if (!ignoreFolders.includes(path)) {
          scanForTests(`${currPath}/${path}`, config)
        }
      })
    }
  }
}

const main = config => {
  const { paths } = config
  return paths.reduce((agg, path) => {
    fwot = []
    fwt = []
    log(chalk.white.bgBlue(` Scanning ${path} for tests... `))
    scanForTests(path, config)
    return {
      ...agg,
      [path]: {
        filesWithoutTests: fwot,
        filesWithTests: fwt,
      },
    }
  }, {})
}

module.exports = main
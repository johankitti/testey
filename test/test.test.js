const { expect } = require('chai')

const main = require('../src/main')
const defaultConfig = require('../defaultConfig')

describe('jest', () => {
  it('should find test files and test files missing', () => {
    const config = {
      ...defaultConfig,
      paths: ['./test-data/jest'],
    }
    const results = main(config)
    expect(results).to.deep.equal({
      './test-data/jest': {
        filesWithTests: ['./test-data/jest/test1.js', './test-data/jest/test3.js'],
        filesWithoutTests: ['./test-data/jest/test2.js'],
      },
    })
  })
})

describe('jestsamefolder', () => {
  it('should find test files and test files missing', () => {
    const config = {
      ...defaultConfig,
      paths: ['./test-data/jestsamefolder'],
      relativePath: '',
    }
    const results = main(config)
    expect(results).to.deep.equal({
      './test-data/jestsamefolder': {
        filesWithTests: ['./test-data/jestsamefolder/test2.js'],
        filesWithoutTests: ['./test-data/jestsamefolder/test1.js'],
      },
    })
  })
})

describe('samefolder', () => {
  it('should find test files and test files missing', () => {
    const config = {
      ...defaultConfig,
      paths: ['./test-data/samefolder'],
      relativePath: '',
      fileEnd: '.test.js',
    }
    const results = main(config)
    expect(results).to.deep.equal({
      './test-data/samefolder': {
        filesWithTests: ['./test-data/samefolder/test1.js'],
        filesWithoutTests: ['./test-data/samefolder/test2.js'],
      },
    })
  })
})

describe('prevfolder', () => {
  it('should find test files and test files missing', () => {
    const config = {
      ...defaultConfig,
      paths: ['./test-data/prevfolder/test'],
      relativePath: '../',
      fileEnd: '.test.js',
    }
    const results = main(config)
    expect(results).to.deep.equal({
      './test-data/prevfolder/test': {
        filesWithTests: ['./test-data/prevfolder/test/test1.js', './test-data/prevfolder/test/test3.js'],
        filesWithoutTests: ['./test-data/prevfolder/test/test2.js'],
      },
    })
  })
})

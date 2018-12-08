const { expect } = require('chai')

const main = require('../src/main')
const parseConfig = require('../src/parseConfig')
const defaultConfig = require('../defaultConfig')

describe('jest files', () => {
  it('should find test files and test files missing', () => {
    const config = parseConfig(
      ['test-data/jest/test1.js', 'test-data/jest/test2.js', '-fe', '.spec.js', '-rp', './__tests__/'],
      defaultConfig,
    )
    const results = main(config)
    expect(results).to.deep.equal({
      'test-data/jest/test1.js': {
        filesWithTests: ['test-data/jest/test1.js'],
        filesWithoutTests: [],
      },
      'test-data/jest/test2.js': {
        filesWithTests: [],
        filesWithoutTests: ['test-data/jest/test2.js'],
      },
    })
  })
})

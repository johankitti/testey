const parseConfig = (argv, defaultConfig) => {
  const args = argv.splice(2)
  const configArgs = args.reduce((agg, arg, index) => {
    if (arg === '-rp') {
      let path = args[index + 1]
      if (path.startsWith('.')) {
        path = path.slice(1)
      }
      if (path === '/') {
        path = ''
      } else {
        if (path.startsWith('/')) {
          path = path.slice(1)
        }
        if (!path.endsWith('/')) {
          path = `${path}/`
        }
      }
      return {
        ...agg,
        relativePath: path,
      }
    } else if (index > 0 && args[index - 1] === '-rp') {
      return agg
    }

    if (arg === '-fe') {
      return {
        ...agg,
        fileEnd: args[index + 1],
      }
    } else if (index > 0 && args[index - 1] === '-fe') {
      return agg
    }

    if (arg === '-c') {
      return {
        ...agg,
        check: true,
      }
    }
    return {
      ...agg,
      paths: [...(agg.paths ? agg.paths : []), arg],
    }
  }, {})

  return {
    ...defaultConfig,
    ...configArgs,
  }
}

module.exports = parseConfig

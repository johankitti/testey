const parseConfig = (args, defaultConfig) => {
  const configArgs = args.reduce((agg, arg, index) => {
    if (arg === '-rp') {
      let path = args[index + 1]
      if (!path.startsWith('..') && path.startsWith('.')) {
        path = path.slice(1)
      }
      if (path === '/') {
        path = ''
      } else {
        if (path.startsWith('/')) {
          path = path.slice(1)
        }
        if (path.endsWith('/')) {
          path = path.slice(0, -1)
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

    if (arg === '-l') {
      return {
        ...agg,
        list: true,
      }
    }

    if (arg === '-c') {
      return {
        ...agg,
        check: true,
      }
    }
    const newPath = arg.endsWith('/') ? arg.slice(0, -1) : arg
    return {
      ...agg,
      paths: [...(agg.paths ? agg.paths : []), newPath],
    }
  }, {})

  return {
    ...defaultConfig,
    ...configArgs,
  }
}

module.exports = parseConfig

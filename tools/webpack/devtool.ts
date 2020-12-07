import { Configuration } from 'webpack'
import { isString } from 'lodash'
import { Argv } from './types'

export default function getDevtool(argv: Argv): Configuration['devtool'] {
  let devtool = 'nosources-source-map'

  if (isString(argv.sourcemap)) {
    devtool = argv.sourcemap
  }

  return devtool
}
